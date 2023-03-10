<?php

namespace App\Http\Resources;

use App\Http\Api\MdRender;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Api\StudioApi;
use App\Http\Api\UserApi;
use App\Http\Api\ChannelApi;
use App\Http\Api\SuggestionApi;

class SentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $channel = ChannelApi::getById($this->channel_uid);
        $data = [
                "id" => $this->uid,
                "content"=>$this->content,
                "html"=> MdRender::render($this->content,$this->channel_uid),
                "book"=> $this->book_id,
                "paragraph"=> $this->paragraph,
                "word_start"=> $this->word_start,
                "word_end"=> $this->word_end,
                "editor"=> UserApi::getById($this->editor_uid),
                "channel"=> $channel,
                "studio" => StudioApi::getById($channel["studio_id"]),
                "updated_at"=> $this->updated_at,
                "suggestionCount" => SuggestionApi::getCountBySent($this->book_id,
                                                                   $this->paragraph,
                                                                   $this->word_start,
                                                                   $this->word_end,
                                                                   $this->channel_uid
                                                                ),
            ];

        if(isset($this->acceptor_uid) && !empty($this->acceptor_uid)){
            $data["acceptor"]=UserApi::getById($this->acceptor_uid);
            $data["pr_edit_at"]=$this->pr_edit_at;
        }
        return $data;
    }
}
