<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Api\MdRender;
use App\Http\Api\UserApi;
use App\Models\CourseMember;
use App\Models\Course;
use Illuminate\Support\Facades\Log;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $data = [
            "uid" => $this->uid,
            "title" => $this->title,
            "subtitle" => $this->subtitle,
            "summary" => $this->summary,
            "studio"=> \App\Http\Api\StudioApi::getById($this->owner),
            "editor"=> \App\Http\Api\UserApi::getById($this->editor_id),
            "status" => $this->status,
            "lang" => $this->lang,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
        if(isset($this->content) && !empty($this->content)){
            if($request->has('channel')){
                $channel = $request->get('channel');
            }else{
                $channel = '';
            }
            $data["content"] = $this->content;
            $data["content_type"] = $this->content_type;
            $query_id = null;
            if($request->has('course')){
                if($request->has('exercise')){
                    $query_id = $request->get('exercise');
                    if($request->has('user')){
                        /**
                         * 显示指定用户作业
                         * 查询用户在课程中的channel
                         */
                        $userId = UserApi::getIdByName($request->get('user'));
                        Log::info("userId:{$userId}");

                        $userInCourse = CourseMember::where('course_id',$request->get('course'))
                                    ->where('user_id',$userId)
                                    ->first();
                        if($userInCourse){
                            $channel = $userInCourse->channel_id;
                        }
                    }else if($request->get('view')==="answer"){
                        /**
                         * 显示答案
                         * 算法：查询course 答案 channel
                         */
                        $channel = Course::where('id',$request->get('course'))->value('channel_id');
                    }else{
                        //显示答案
                        $channel = Course::where('id',$request->get('course'))->value('channel_id');
                    }
                }else{
                    $channel = Course::where('id',$request->get('course'))->value('channel_id');
                }
            }
            Log::info("channel:{$channel}");
            Log::info("query_id:{$query_id}");
            if($request->has('mode')){
                $mode = $request->get('mode');
            }else{
                $mode = 'read';
            }
            $data["html"] = MdRender::render($this->content,$channel,$query_id,$mode);
        }
        return $data;
    }
}
