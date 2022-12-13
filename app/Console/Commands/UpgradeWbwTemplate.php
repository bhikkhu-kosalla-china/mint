<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PaliSentence;
use App\Models\WbwTemplate;
use App\Models\Sentence;
use App\Http\Api\ChannelApi;
use Illuminate\Support\Str;

class UpgradeWbwTemplate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'upgrade:wbw.template {book?} {para?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'upgrade wbw template by sentence';

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
		$pali = new PaliSentence;
		if(!empty($this->argument('book'))){
			$pali = $pali->where('book',$this->argument('book'));
		}
		if(!empty($this->argument('para'))){
			$pali = $pali->where('paragraph',$this->argument('para'));
		}
		$bar = $this->output->createProgressBar($pali->count());
        $channelId = ChannelApi::getSysChannel('_System_Wbw_VRI_');
        if($channelId===false){
            $this->error('no channel');
            return 1;
        }
		$pali = $pali->select('book','paragraph','word_begin','word_end')->cursor();
		foreach ($pali as $value) {
			# code...
            $wbwContent=[];
			$words = WbwTemplate::where("book",$value->book)
								->where("paragraph",$value->paragraph)
								->where("wid",">=",$value->word_begin)
								->where("wid","<=",$value->word_end)
								->orderBy('wid','asc')
								->get();
			$sent = '';
			foreach ($words as $wbw_word) {
                # code...
                $type = $wbw_word->type=='?'? '':$wbw_word->type;
                $grammar = $wbw_word->gramma=='?'? '':$wbw_word->gramma;
                $part = $wbw_word->part=='?'? '':$wbw_word->part;
                $wbwContent[] = [
                    'word'=>['value'=>$wbw_word->word,'status'=>0],
                    'real'=> ['value'=>$wbw_word->word,'status'=>0],
                    'meaning'=> ['value'=>[],'status'=>0],
                    'type'=> ['value'=>$type,'status'=>0],
                    'grammar'=> ['value'=>$grammar,'status'=>0],
                    'case'=> ['value'=>[],'status'=>0],
                    'style'=> ['value'=>$wbw_word->style,'status'=>0],
                    'factors'=> ['value'=>$part,'status'=>0],
                    'factorMeaning'=> ['value'=>'','status'=>0],
                    'confidence'=> 0.5
                ];

            }
            $sent = \json_encode($wbwContent);

			$newRow = Sentence::updateOrCreate(
				[
					"book_id" => $value->book,
					"paragraph" => $value->paragraph,
					"word_start" => $value->word_begin,
					"word_end" => $value->word_end,
					"channel_uid" => $channelId,
				],
				[
					'id' =>app('snowflake')->id(),
					'uid' =>Str::uuid(),
					'editor_uid'=>config("app.admin.root_uuid"),
					'content'=>trim($sent),
					'strlen'=>mb_strlen($sent,"UTF-8"),
					'status' => 30,
					'create_time'=>time()*1000,
					'modify_time'=>time()*1000,
					'language'=>'en'
				]
				);
			$bar->advance();
		}
		$bar->finish();
		$this->info("finished ".(time()-$start)."s");
        return 0;
    }
}
