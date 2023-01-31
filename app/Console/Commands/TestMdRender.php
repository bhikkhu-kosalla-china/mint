<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Api\MdRender;

class TestMdRender extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:md.render';

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
        $markdown = "# heading [[isipatana]] \n\n";
        $markdown .= "[[isipatana]] `bla` [[dhammacakka]]\n\n";
        $markdown .= "```haha\n";
        $markdown .= "content **content**\n";
        $markdown .= "content **content**\n";
        $markdown .= "```\n\n";
        $markdown .= "{{168-916-10-37}}";
        $markdown .= "{{exercise|1|((168-916-10-37))}}";

        $markdown2 = "# heading [[isipatana]] \n\n";
        $markdown2 .= "{{exercise\n|id=1\n|content={{168-916-10-37}}}}";
        $markdown2 .= "{{exercise\n|id=2\n|content=# ddd}}";

        //echo MdRender::render($markdown,'00ae2c48-c204-4082-ae79-79ba2740d506');
        $wiki = MdRender::markdown2wiki($markdown2);
        $xml = MdRender::wiki2xml($wiki);
        $html = MdRender::xmlQueryId($xml, "1");
        $sent = MdRender::take_sentence($html);
        print_r($sent);
        //echo MdRender::render2($markdown2,'00ae2c48-c204-4082-ae79-79ba2740d506','2');
        return 0;
    }
}
