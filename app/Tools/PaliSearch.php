<?php
namespace App\Tools;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class PaliSearch
{
    public static function search($words,$books,$matchMode='case',$index=0,$size=10){
        $host = config('mint.server.rpc.tulip');
        Log::debug('tulip host='.$host);
        $client = new \Mint\Tulip\V1\SearchClient($host, [
            'credentials' => \Grpc\ChannelCredentials::createInsecure(),
        ]);

        $request = new \Mint\Tulip\V1\SearchRequest();
        $request->setKeywords($words);
        $request->setBooks($books);
        $request->setMatchMode($matchMode);
        $page = new \Mint\Tulip\V1\SearchRequest\Page;
        $page->setIndex($index);
        $page->setSize($size);
        $request->setPage($page);

        list($response, $status) = $client->Pali($request)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {
            Log::error("ERROR: " . $status->code . ", " . $status->details);
            return false;
        }
        $output = [];
        $output['total'] = $response->getTotal();
        $output['rows'] = [];
        foreach ($response->getItems() as $key => $value) {
            $output['rows'][] = [
                'rank' => $value->getRank(),
                'highlight' => $value->getHighlight(),
                'book' => $value->getBook(),
                'paragraph' => $value->getParagraph(),
                'content' => $value->getContent(),
            ];
        }
        return $output;
    }

    public static function book_list($words,$books,$matchMode='case',$index=0,$size=10){
        $host = config('mint.server.rpc.tulip');
        Log::debug('tulip host='.$host);
        $client = new \Mint\Tulip\V1\SearchClient($host, [
            'credentials' => \Grpc\ChannelCredentials::createInsecure(),
        ]);

        $request = new \Mint\Tulip\V1\SearchRequest();
        $request->setKeywords($words);
        $request->setBooks($books);
        $request->setMatchMode($matchMode);
        $page = new \Mint\Tulip\V1\SearchRequest\Page;
        $page->setIndex($index);
        $page->setSize($size);
        $request->setPage($page);

        list($response, $status) = $client->BookList($request)->wait();
        if ($status->code !== \Grpc\STATUS_OK) {
            Log::error("ERROR: " . $status->code . ", " . $status->details);
            return false;
        }
        $output = [];
        $output['rows'] = [];
        foreach ($response->getItems() as $key => $value) {
            $output['rows'][] = [
                'pcd_book_id' => $value->getBook(),
                'co' => $value->getCount(),
            ];
        }
        return $output;
    }
}
