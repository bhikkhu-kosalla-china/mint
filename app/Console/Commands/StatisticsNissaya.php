<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Channel;
use App\Models\Sentence;
use Illuminate\Support\Facades\Storage;

class StatisticsNissaya extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'statistics:nissaya';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '统计nissaya 每日录入进度';

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
        $nissaya_channel = Channel::where('type','nissaya')->select('uid')->get();
        $channels = [];
        foreach ($nissaya_channel as $key => $value) {
            # code...
            $channels[] = $value->uid;
        }
        $this->info('channel:'.count($channels));
        $maxDay = 300;
        $file = "public/export/nissaya-daily.csv";
        Storage::disk('local')->put($file, "");
        #按天获取数据
        for($i = 1; $i <= $maxDay; $i++){
            $day = strtotime("today -{$i} day");
            $date = date("Y-m-d",$day);
            $strlen = Sentence::whereIn('channel_uid',$channels)
                    ->whereDate('created_at','=',$date)
                    ->sum('strlen');
            $this->info($date.','.$strlen);
            Storage::disk('local')->append($file, $date.','.$strlen);
        }
        return 0;
    }
}
