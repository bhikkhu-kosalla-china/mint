<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Tools\RedisClusters;

class ExportZip extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'export:zip {format?  : zip file format 7z,lzma,gz }';

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
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Log::debug('export offline: 开始压缩');
        $this->info('export offline: 开始压缩');
        $exportPath = 'app/public/export/offline';
        $exportFile = 'wikipali-offline-'.date("Y-m-d").'.db3';
        Log::debug('export offline: zip file {filename} {format}',
                    [
                        'filename'=>$exportFile,
                        'format'=>$this->argument('format')
                    ]);
        switch ($this->argument('format')) {
            case '7z':
                $zipFile = $exportFile . ".7z";
                break;
            case 'lzma':
                $zipFile = $exportFile . ".lzma";
                break;
            default:
                $zipFile = $exportFile . ".gz";
                break;
        }
        //
        $exportFullFileName = storage_path($exportPath.'/'.$exportFile);
        if(!file_exists($exportFullFileName)){
            Log::error('export offline: no db file {filename}',['filename'=>$exportFullFileName]);
            $this->error('export offline: no db file {filename}'.$exportFullFileName);
            return 1;
        }
        $zipFullFileName = storage_path($exportPath.'/'.$zipFile);

        shell_exec("cd ".storage_path($exportPath));
        if($this->argument('format')==='7z'){
            $command = "7z a -t7z -m0=lzma -mx=9 -mfb=64 -md=32m -ms=on {$zipFullFileName} {$exportFullFileName}";
        }else if($this->argument('format')==='lzma'){
            $command = "xz -k -9 --format=lzma {$exportFullFileName}";
        }else{
            $command = "gzip -k -q --best -c {$exportFullFileName} > {$zipFullFileName}";
        }
        $this->info($command);
        Log::debug('export offline: zip command:'.$command);
        shell_exec($command);
        $this->info('压缩完成');
        Log::debug('zip file {filename} in {format} saved.',
                    [
                        'filename'=>$exportFile,
                        'format'=>$this->argument('format')
                    ]);
        $info = array();
        $url = array();
        foreach (config('mint.server.cdn_urls') as $key => $cdn) {
            $url[] = [
                    'link' => $cdn . '/' . $zipFile,
                    'hostname' =>'cdn-' . $key,
                ];
        }

        //s3
        Storage::put($zipFile, file_get_contents($zipFullFileName));
        $s3Link = Storage::url($zipFile);
        Log::info('export offline: link='.$s3Link);
        $url[] = [
            'link'=>$s3Link,
            'hostname'=>'Amazon cloud storage(Hongkong)',
        ];
        $info[] = ['filename'=>$zipFile,
                    'url' => $url,
                   'create_at'=>date("Y-m-d H:i:s"),
                   'chapter'=>RedisClusters::get("/export/chapter/count"),
                   'filesize'=>filesize($zipFullFileName),
                   'min_app_ver'=>'1.3',
                    ];
        RedisClusters::put('/offline/index',$info);
        unlink($exportFullFileName);
        return 0;
    }
}
