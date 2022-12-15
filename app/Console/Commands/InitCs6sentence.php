<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PaliSentence;
use App\Models\WbwTemplate;
use App\Models\Sentence;
use Illuminate\Support\Str;
use App\Http\Api\ChannelApi;


class InitCs6sentence extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'init:cs6sentence {book?} {para?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '按照分句数据库，填充cs6的巴利原文句子';

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
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
		$start = time();
        $channelId = ChannelApi::getSysChannel('_System_Pali_VRI_');
        if($channelId === false){
            $this->error('no channel');
            return 1;
        }
		$pali = new PaliSentence;
		if(!empty($this->argument('book'))){
			$pali = $pali->where('book',$this->argument('book'));
		}
		if(!empty($this->argument('para'))){
			$pali = $pali->where('paragraph',$this->argument('para'));
		}
		$bar = $this->output->createProgressBar($pali->count());
		$pali = $pali->select('book','paragraph','word_begin','word_end')->cursor();
		foreach ($pali as $value) {
			# code...
			$words = WbwTemplate::where("book",$value->book)
								->where("paragraph",$value->paragraph)
								->where("wid",">=",$value->word_begin)
								->where("wid","<=",$value->word_end)
								->orderBy('wid','asc')
								->get();
			$sent = '';
			$boldStart = false;
			$boldCount = 0;
			foreach ($words as $word) {
				# code...
				//if($word->style != "note" && $word->type != '.ctl.')
				if( $word->type != '.ctl.')
                {
					if($word->style=='bld'){
						if(!$boldStart){
							#黑体字开始
							$boldStart = true;
							$sent .= ' <b>';
						}
					}else{
						if($boldStart){
							#黑体字结束
							$boldStart = false;
							$boldCount = 0;
							$sent .= '</b>';
						}
					}
					if($boldStart){
						$boldCount++;
					}
					if(!empty($word->real) && $boldCount != 1){
						#如果不是标点符号，在词的前面加空格 。第一个黑体字前不加空格
						$sent .= " ";
					}

					if(strpos($word->word,'{') >=0 ){
                        //一个单词里面含有黑体字的
						$paliWord = \str_replace("{","<b>",$word->word) ;
						$paliWord = \str_replace("}","</b>",$paliWord) ;
					}else{
						$paliWord = $word->word;
					}
					$sent .= $paliWord;
				}
			}
			if($boldStart){
				#句子结尾是黑体字 加黑体结束符号
				$boldStart = false;
				$sent .= '** ';
			}
			#将wikipali风格的引用 改为缅文风格
            /*
			$sent = \str_replace('n’’’ ti','’’’nti',$sent);
			$sent = \str_replace('n’’ ti','’’nti',$sent);
			$sent = \str_replace('n’ ti','’nti',$sent);
			$sent = \str_replace('**ti**','**ti',$sent);
			$sent = \str_replace('‘ ','‘',$sent);
            */
			$sent = trim($sent);
			$snowId = app('snowflake')->id();
			$newRow = Sentence::updateOrCreate(
				[
					"book_id" => $value->book,
					"paragraph" => $value->paragraph,
					"word_start" => $value->word_begin,
					"word_end" => $value->word_end,
					"channel_uid" => $channelId,
				],
				[
					'id' =>$snowId,
					'uid' =>Str::uuid(),
				]
				);
            $newRow->editor_uid = config("app.admin.root_uuid");
            $newRow->content = trim($sent);
            $newRow->strlen = mb_strlen($sent,"UTF-8");
            $newRow->status = 30;
            $newRow->create_time = time()*1000;
            $newRow->modify_time = time()*1000;
            $newRow->language = 'en';
            $newRow->save();

			$bar->advance();
		}
		$bar->finish();
		$this->info("finished ".(time()-$start)."s");
        return 0;
    }
}
