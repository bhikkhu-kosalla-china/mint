<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\ProgressChapter;
use App\Models\Channel;
use App\Models\PaliText;
use App\Models\Sentence;
use App\Http\Api\ChannelApi;
use App\Http\Api\MdRender;
use App\Tools\Export;
use Illuminate\Support\Facades\Log;
use App\Tools\RedisClusters;
use Illuminate\Support\Str;

class ExportChapter extends Command
{
    protected $exportStatusKey = 'export/status';
    protected $exportStatusExpiry = 3600;
    protected $currExportStatusKey = '';
    protected $realFilename = null;
    /**
     * The name and signature of the console command.
     * php artisan export:chapter 213 3 a19eaf75-c63f-4b84-8125-1bce18311e23 213-3.html --format=html --origin=true
     * php artisan export:chapter 168 915 19f53a65-81db-4b7d-8144-ac33f1217d34 168-915.html --format=html
     * php artisan export:chapter 168 915 19f53a65-81db-4b7d-8144-ac33f1217d34 168-915.html --format=html --origin=true
     * @var string
     */
    protected $signature = 'export:chapter {book} {para} {channel} {filename} {--origin=false} {--translation=true} {--debug} {--format=tex} ';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * progress: 0-1, error -1
     * message: string
     */
    protected function setStatus($progress,$message=''){
        $data = [
                    'progress'=>$progress,
                    'message'=>$message,
                    'content-type'=>'application/zip',
                ];
        if($this->realFilename){
            $data['filename'] = $this->realFilename;
        }
        RedisClusters::put($this->currExportStatusKey,
                            $data,
                            $this->exportStatusExpiry);
        $percent = (int)($progress * 100);
        $this->info("[{$percent}%]".$message);
    }


    public function getStatus($filename){
        return RedisClusters::get($this->exportStatusKey.'/'.$filename);
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('task export chapter start');
        Log::debug('task export chapter start');
        if(\App\Tools\Tools::isStop()){
            return 0;
        }
        $m = new \Mustache_Engine(array('entity_flags'=>ENT_QUOTES,
                                        'delimiters' => '[[ ]]',
                                        'escape'=>function ($value){
                                            return $value;
                                        }));
        $tplFile = resource_path("mustache/".$this->option('format')."/paragraph.".$this->option('format'));
        $tplParagraph = file_get_contents($tplFile);

        MdRender::init();

        $this->currExportStatusKey = $this->exportStatusKey . '/' . $this->argument('filename');
        $this->realFilename = $this->argument('filename').'.zip';

        switch ($this->option('format')) {
            case 'md':
                $renderFormat='markdown';
                break;
            case 'html':
                $renderFormat='html';
                break;
            default:
                $renderFormat=$this->option('format');
                break;
        }
        $book = $this->argument('book');
        $para = $this->argument('para');
        //zip压缩包里面的文件名
        $realFileName = "{$book}-{$para}.".$this->option('format');
        //获取原文channel
        $orgChannelId = ChannelApi::getSysChannel('_System_Pali_VRI_');

        $tranChannelsId = explode('_',$this->argument('channel'));

        $channelsId = array_merge([$orgChannelId],$tranChannelsId);

        $channels = array();
        $channelsIndex = array();
        foreach ($channelsId as $key => $id) {
            $channels[] = ChannelApi::getById($id);
            $channelsIndex[$id] = ChannelApi::getById($id);
        }

        $bookMeta = array();
        $bookMeta['book_author'] = "";
        foreach ($channels as $key => $channel) {
            $bookMeta['book_author'] .= $channel['name'] . ' ';
        }

        $chapter = PaliText::where('book',$book)
                           ->where('paragraph',$para)->first();
        if(!$chapter){
            return $this->error("no data");
        }

        $currProgress = 0;
        $this->setStatus($currProgress,'start');


        if(empty($chapter->toc)){
            $bookMeta['title'] = "unknown";
        }else{
            $bookMeta['book_title'] = '';
            foreach ($channelsId as $key => $id) {
                $title = ProgressChapter::where('book',$book)->where('para',$para)
                        ->where('channel_id',$id)
                        ->value('title');
                $bookMeta['book_title'] .= $title;
            }
            $bookMeta['sub_title'] = $chapter->toc;
        }

        $subChapter = PaliText::where('book',$book)->where('parent',$para)
                              ->where('level','<',8)
                              ->orderBy('paragraph')
                              ->get();
        if(count($subChapter) === 0){
            //没有子章节
            $subChapter = PaliText::where('book',$book)->where('paragraph',$para)
                              ->where('level','<',8)
                              ->orderBy('paragraph')
                              ->get();
        }

        $chapterParagraph = PaliText::where('book',$book)->where('paragraph',$para)->value('chapter_len');
        if($chapterParagraph >0 ){
            $step = 0.9 / $chapterParagraph;
        }else{
            $step = 0.9;
            Log::error('段落长度不能为0',['book'=>$book,'para'=>$para]);
        }

        $outputChannelsId = [];
        if($this->option('origin') === 'true'){
            $outputChannelsId[] = $orgChannelId;
        }
        if($this->option('translation') === 'true'){
            $outputChannelsId = array_merge($outputChannelsId,$tranChannelsId);
        }

        $sections = array();
        foreach ($subChapter as $key => $sub) {
            # 看这个章节是否存在译文
            $hasChapter = false;
            if($this->option('origin') === 'true'){
                $hasChapter = true;
            }
            if($this->option('translation') === 'true'){
                foreach ($tranChannelsId as $id) {
                    if(ProgressChapter::where('book',$book)->where('para',$sub->paragraph)
                        ->where('channel_id',$id)
                        ->exists()){
                            $hasChapter = true;
                    }
                }
            }
            if(!$hasChapter){
                //不存在需要导出的数据
                continue;
            }
            $filename = "{$sub->paragraph}.".$this->option('format');
            $bookMeta['sections'][] = ['filename'=>$filename];
            $paliTitle = PaliText::where('book',$book)
                                 ->where('paragraph',$sub->paragraph)
                                 ->value('toc');
            $sectionTitle = $paliTitle;
            if($this->option('translation') === 'true'){
                $chapter = ProgressChapter::where('book',$book)->where('para',$sub->paragraph)
                                        ->where('channel_id',$tranChannelsId[0])
                                        ->first();
                if($chapter && !empty($chapter->title)){
                    $sectionTitle = $chapter->title;
                }
            }


            $content = array();

            $chapterStart = $sub->paragraph+1;
            $chapterEnd = $sub->paragraph + $sub->chapter_len;
            $chapterBody = PaliText::where('book',$book)
                                    ->whereBetween('paragraph',[$chapterStart,$chapterEnd])
                                    ->orderBy('paragraph')->get();



            foreach ($chapterBody as $body) {
                $currProgress += $step;
                $this->setStatus($currProgress,'export chapter '.$body->paragraph);
                $paraData = array();
                $paraData['translations'] = array();
                foreach ($outputChannelsId as $key => $channelId) {
                    $translationData = Sentence::where('book_id',$book)
                                        ->where('paragraph',$body->paragraph)
                                        ->where('channel_uid',$channelId)
                                        ->orderBy('word_start')->get();
                    $sentContent = array();
                    foreach ($translationData as $sent) {
                        $texText = MdRender::render($sent->content,
                                                    [$sent->channel_uid],
                                                    null,
                                                    'read',
                                                    $channelsIndex[$channelId]['type'],
                                                    $sent->content_type,
                                                    $renderFormat
                                                    );
                        $sentContent[] = trim($texText);
                    }
                    $paraContent = implode(' ',$sentContent);
                    if($channelsIndex[$channelId]['type'] === 'original'){
                        $paraData['origin'] = $paraContent;
                    }else{
                        $paraData['translations'][] = ['content'=>$paraContent];
                    }
                }
                if($body->level > 7){
                    $content[] = $m->render($tplParagraph,$paraData);
                }else{
                    $currLevel = $body->level - $sub->level;
                    if($currLevel<=0){
                        $currLevel = 1;
                    }

                    if(count($paraData['translations'])===0){
                        $subSessionTitle = PaliText::where('book',$book)
                                            ->where('paragraph',$body->paragraph)
                                            ->value('toc');
                    }else{
                        $subSessionTitle = $paraData['translations'][0]['content'];
                    }
                    switch ($this->option('format')) {
                        case 'tex':
                            $subStr = array_fill(0,$currLevel,'sub');
                            $content[] = '\\'. implode('',$subStr) . "section{".$subSessionTitle.'}';
                            break;
                        case 'md':
                            $subStr = array_fill(0,$currLevel,'#');
                            $content[] = implode('',$subStr) . " ".$subSessionTitle;
                            break;
                        case 'html':
                            $level = $currLevel+2;
                            $content[] = "<h{$currLevel}>".$subSessionTitle."</h{$currLevel}>";
                            break;
                    }
                }
                $content[] = "\n\n";
            }

            $sections[] = [
                    'name'=>$filename,
                    'body'=>[
                        'title'=>$sectionTitle,
                        'content'=>implode('',$content)
                    ]
                ];
        }

        $this->setStatus(0.9,'export content done');
        Log::debug('导出结束');

        $tex = array();

        $tpl = file_get_contents(resource_path("mustache/".$this->option('format')."/main.".$this->option('format')));
        $texContent = $m->render($tpl,$bookMeta);
        $tex[] = ['name'=>'main.'.$this->option('format'),
                  'content'=>$texContent
                 ];
        foreach ($sections as $key => $section) {
            $tpl = file_get_contents(resource_path("mustache/".$this->option('format')."/section.".$this->option('format')));
            $texContent = $m->render($tpl,$section['body']);
            $tex[] = ['name'=>$section['name'],
                  'content'=>$texContent
                 ];
        }

        Log::debug('footnote start');
        //footnote
        $tplFile = resource_path("mustache/".$this->option('format')."/footnote.".$this->option('format'));
        if(isset($GLOBALS['note']) &&
            is_array($GLOBALS['note']) &&
            count($GLOBALS['note'])>0 &&
            file_exists($tplFile)){
            $tpl = file_get_contents($tplFile);
            $texContent = $m->render($tpl,['footnote'=>$GLOBALS['note']]);
            $tex[] = ['name'=>'footnote.'.$this->option('format'),
                        'content'=>$texContent
                        ];
        }
        if($this->option('debug')){
            $dir = "export/".$this->option('format')."/{$book}-{$para}-{$channelId}/";
            foreach ($tex as $key => $section) {
                Storage::disk('local')->put($dir.$section['name'], $section['content']);
            }
        }

        Log::debug('footnote finished');
        $this->setStatus(0.95,'export content done.');

        //upload
        $fileDate = '';
        switch ($this->option('format')) {
            case 'tex':
                $data = Export::ToPdf($tex);
                if($data['ok']){
                    $this->info($data['content-type']);
                    $fileDate = $data['data'];
                }else{
                    $this->error($data['code'].'-'.$data['message']);
                }
                break;
            case 'html':
                $file = array();
                foreach ($tex as $key => $section) {
                    $file[] = $section['content'];
                }
                $fileDate = implode('',$file);
                break;
        }


        $zipDir = storage_path('app/export/zip');
        if(!is_dir($zipDir)){
            $res = mkdir($zipDir,0755,true);
            if(!$res){
                Log::error('mkdir fail path='.$zipDir);
                return 1;
            }
        }
        $zipFile = $zipDir.'/'.Str::uuid().'.zip';

        Log::debug('export chapter start zip  file='.$zipFile);

        $zipOk = \App\Tools\Tools::zip($zipFile,[$realFileName=>$fileDate]);
        if(!$zipOk){
            Log::error('export chapter zip fail zip file='.$zipFile);
            $this->setStatus(0.99,'export chapter zip fail');
            $this->error('export chapter zip fail zip file='.$zipFile);
            //TODO 给客户端返回错误状态
            return 1;
        }
        $this->setStatus(0.96,'export chapter zip success');

        $bucket = config('mint.attachments.bucket_name.temporary');
        $tmpFile =  $bucket.'/'. $this->realFilename ;
        Log::debug('upload start filename='.$tmpFile);
        $this->setStatus(0.97,'upload start ');
        $zipData = file_get_contents($zipFile);
        Storage::put($tmpFile, $zipData);
        $this->setStatus(1,'export chapter done');
        Log::debug('export chapter done, upload filename='.$tmpFile);

        unlink($zipFile);
        return 0;
    }
}
