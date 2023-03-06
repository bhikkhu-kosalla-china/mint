<?php

namespace App\Http\Controllers;

require_once __DIR__.'/../../../public/app/ucenter/function.php';

use App\Models\Channel;
use App\Models\Sentence;
use App\Models\DhammaTerm;
use App\Models\WbwBlock;
use App\Models\PaliSentence;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Api\AuthApi;
use App\Http\Api\StudioApi;
use App\Http\Api\ShareApi;
use App\Http\Api\PaliTextApi;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ChannelController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $userinfo = new \UserInfo();
		$result=false;
		$indexCol = ['uid','name','summary','type','owner_uid','lang','status','updated_at','created_at'];
		switch ($request->get('view')) {
            case 'studio':
				# 获取studio内所有channel
                $user = AuthApi::current($request);
                if($user){
                    //判断当前用户是否有指定的studio的权限
                    if($user['user_uid'] === \App\Http\Api\StudioApi::getIdByName($request->get('name'))){
                        $table = Channel::select($indexCol)->where('owner_uid', $user["user_uid"]);
                    }else{
                        return $this->error(__('auth.failed'));
                    }
                }else{
                    return $this->error(__('auth.failed'));
                }
				break;
            case 'user-edit':
                /**
                 * 某用户有编辑权限的
                 */
                #获取user所有有权限的channel列表
                $user = AuthApi::current($request);
                if(!$user){
                    return $this->error(__('auth.failed'));
                }
                $channelById = [];
                $channelId = [];
                //获取共享channel
                $allSharedChannels = ShareApi::getResList($user['user_uid'],2);
                foreach ($allSharedChannels as $key => $value) {
                    # code...
                    if($value['power']>=20){
                        $channelId[] = $value['res_id'];
                        $channelById[$value['res_id']] = $value;
                    }
                }
                $table = Channel::select($indexCol)
                            ->whereIn('uid', $channelId)
                            ->orWhere('owner_uid',$user['user_uid']);
                break;
            case 'user-in-chapter':
                #获取user 在某章节 所有有权限的channel列表
                $user = AuthApi::current($request);
                if($user){
                    $channelById = [];
                    $channelId = [];
                    //获取共享channel
                    $allSharedChannels = ShareApi::getResList($user['user_uid'],2);
                    foreach ($allSharedChannels as $key => $value) {
                        # code...
                        $channelId[] = $value['res_id'];
                        $channelById[$value['res_id']] = $value;
                    }
                    //获取全网公开channel
                    $chapter = PaliTextApi::getChapterStartEnd($request->get('book'),$request->get('para'));
                    $publicChannelsWithContent = Sentence::where('book_id',$request->get('book'))
                                                ->whereBetween('paragraph',$chapter)
                                                ->where('strlen','>',0)
                                                ->where('status',30)
                                                ->groupBy('channel_uid')
                                                ->select('channel_uid')
                                                ->get();
                    foreach ($publicChannelsWithContent as $key => $value) {
                        # code...
                        $value['res_id']=$value->channel_uid;
                        $value['power'] = 10;
                        $value['type'] = 2;
                        if(!isset($channelById[$value['res_id']])){
                            $channelId[] = $value['res_id'];
                            $channelById[$value['res_id']] = $value;
                        }
                    }
                    $table = Channel::select($indexCol)
                            ->whereIn('uid', $channelId)
                            ->orWhere('owner_uid',$user['user_uid']);
                }else{
                    return $this->error(__('auth.failed'));
                }
                break;

        }
        //处理搜索
        if(isset($_GET["search"])){
            $table = $table->where('title', 'like', $_GET["search"]."%");
        }
        //获取记录总条数
        $count = $table->count();
        //处理排序
        if(isset($_GET["order"]) && isset($_GET["dir"])){
            $table = $table->orderBy($_GET["order"],$_GET["dir"]);
        }else{
            //默认排序
            $table = $table->orderBy('updated_at','desc');
        }
        //处理分页
        if($request->has("limit")){

            if($request->has("offset")){
                $offset = $request->get("offset");
            }else{
                $offset = 0;
            }
            $table = $table->skip($offset)->take($request->get("limit"));
        }
        //获取数据
        $result = $table->get();
//TODO 将下面代码转移到resource
        if($result){
            if($request->has('progress')){
                //获取进度
                //获取单句长度
                $sentLen = PaliSentence::where('book',$request->get('book'))
                ->whereBetween('paragraph',$chapter)
                ->orderBy('word_begin')
                ->select(['book','paragraph','word_begin','word_end','length'])
                ->get();
            }
            foreach ($result as $key => $value) {
                if($request->has('progress')){
                    //获取进度
                    $finalTable = Sentence::where('book_id',$request->get('book'))
                    ->whereBetween('paragraph',$chapter)
                    ->where('channel_uid',$value->uid)
                    ->where('strlen','>',0)
                    ->select(['strlen','book_id','paragraph','word_start','word_end']);
                    if($finalTable->count()>0){
                        $finished = $finalTable->get();
                        $final=[];
                        foreach ($sentLen as  $sent) {
                            # code...
                            $first = Arr::first($finished, function ($value, $key) use($sent) {
                                return ($value->book_id==$sent->book &&
                                        $value->paragraph==$sent->paragraph &&
                                        $value->word_start==$sent->word_begin &&
                                        $value->word_end==$sent->word_end);
                            });
                            $final[] = [$sent->length,$first?true:false];
                        }
                        $value['final'] = $final;
                    }

                }

                if($value->owner_uid===$user['user_uid']){
                    $value['role'] = 'owner';
                }else{
                    if(isset($channelById[$value->uid])){
                        switch ($channelById[$value->uid]['power']) {
                            case 10:
                                # code...
                                $value['role'] = 'member';
                                break;
                            case 20:
                                $value['role'] = 'editor';
                                break;
                            case 30:
                                $value['role'] = 'owner';
                                break;
                            default:
                                # code...
                                $value['role'] = $channelById[$value->uid]['power'];
                                break;
                        }
                    }
                }
                # 获取studio信息
                $value->studio = \App\Http\Api\StudioApi::getById($value->owner_uid);
            }
			return $this->ok(["rows"=>$result,"count"=>$count]);
		}else{
			return $this->error("没有查询到数据");
		}

    }
    /**
     * 获取章节的进度
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function progress(Request $request){
		$indexCol = ['uid','name','summary','type','owner_uid','lang','status','updated_at','created_at'];

        $sent = $request->get('sentence') ;
        $query = [];
        $sentContainer = [];
        $sentLenContainer = [];

        foreach ($sent as $value) {
            $sentContainer[$value] = false;
            $ids = explode('-',$value);
            $query[] = $ids;
        }
        //获取单句长度
        if(count($query)>0){
            $sentLen = PaliSentence::whereIns(['book','paragraph','word_begin','word_end'],$query)
                                    ->select(['book','paragraph','word_begin','word_end','length'])
                                    ->get();

            foreach ($sentLen as $value) {
                $sentLenContainer["{$value->book}-{$value->paragraph}-{$value->word_begin}-{$value->word_end}"] = $value->length;
            }
        }

        #获取 user 在某章节 所有有权限的 channel 列表
        $user = AuthApi::current($request);
        if(!$user){
            return $this->error(__('auth.failed'));
        }
        $channelById = [];
        $channelId = [];
        //获取共享channel
        $allSharedChannels = ShareApi::getResList($user['user_uid'],2);
        foreach ($allSharedChannels as $key => $value) {
            # code...
            $channelId[] = $value['res_id'];
            $channelById[$value['res_id']] = $value;
        }
        //获取全网公开channel
        $chapter = PaliTextApi::getChapterStartEnd($request->get('book'),$request->get('para'));
        $publicChannelsWithContent = Sentence::where('book_id',$request->get('book'))
                                    ->whereBetween('paragraph',$chapter)
                                    ->where('strlen','>',0)
                                    ->where('status',30)
                                    ->groupBy('channel_uid')
                                    ->select('channel_uid')
                                    ->get();
        foreach ($publicChannelsWithContent as $key => $value) {
            # code...
            $value['res_id']=$value->channel_uid;
            $value['power'] = 10;
            $value['type'] = 2;
            if(!isset($channelById[$value['res_id']])){
                $channelId[] = $value['res_id'];
                $channelById[$value['res_id']] = $value;
            }
        }
        $table = Channel::select($indexCol)
                        ->whereIn('uid', $channelId)
                        ->orWhere('owner_uid',$user['user_uid']);
        $result = $table->get();



        foreach ($result as $key => $value) {
            if($value->owner_uid===$user['user_uid']){
                $value['role'] = 'owner';
            }else{
                if(isset($channelById[$value->uid])){
                    switch ($channelById[$value->uid]['power']) {
                        case 10:
                            # code...
                            $value['role'] = 'member';
                            break;
                        case 20:
                            $value['role'] = 'editor';
                            break;
                        case 30:
                            $value['role'] = 'owner';
                            break;
                        default:
                            # code...
                            $value['role'] = $channelById[$value->uid]['power'];
                            break;
                    }
                }
            }
            # 获取studio信息
            $result[$key]["studio"] = \App\Http\Api\StudioApi::getById($value->owner_uid);

            //获取进度
            if(count($query)>0){
                $finalTable = Sentence::whereIns(['book_id','paragraph','word_start','word_end'],$query)
                                        ->where('channel_uid',$value->uid)
                                        ->where('strlen','>',0)
                                        ->select(['strlen','book_id','paragraph','word_start','word_end']);
                if($finalTable->count()>0){
                    $finished = $finalTable->get();
                    $currChannel = [];
                    foreach ($finished as $key => $value) {
                        $currChannel["{$value->book_id}-{$value->paragraph}-{$value->word_start}-{$value->word_end}"] = 1;
                    }
                    $final=[];
                    foreach ($sentContainer as $sentId=>$value) {
                        # code...
                        if(isset($currChannel[$sentId])){
                            $final[] = [$sentLenContainer[$sentId],true];
                        }else{
                            $final[] = [$sentLenContainer[$sentId],false];
                        }
                    }
                    $result[$key]['final'] = $final;
                }
            }

        }

        return $this->ok(["rows"=>$result,count($result)]);

    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $user = AuthApi::current($request);
        if($user){
            //判断当前用户是否有指定的studio的权限
            if($user['user_uid'] === StudioApi::getIdByName($request->get('studio'))){
                //查询是否重复
                if(Channel::where('name',$request->get('name'))->where('owner_uid',$user['user_uid'])->exists()){
                    return $this->error(__('validation.exists',['name']));
                }else{

                    $channel = new Channel;
                    $channel->id = app('snowflake')->id();
                    $channel->name = $request->get('name');
                    $channel->owner_uid = $user['user_uid'];
                    $channel->type = $request->get('type');
                    $channel->lang = $request->get('lang');
                    $channel->editor_id = $user['user_id'];
                    $channel->create_time = time()*1000;
                    $channel->modify_time = time()*1000;
                    $channel->save();
                    return $this->ok($channel);
                }
            }else{
                return $this->error(__('auth.failed'));
            }
        }else{
            return $this->error(__('auth.failed'));
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        $indexCol = ['uid','name','summary','type','owner_uid','lang','status','updated_at','created_at'];
		$channel = Channel::where("uid",$id)->select($indexCol)->first();
		$userinfo = new \UserInfo();
        $studio = $userinfo->getName($channel->owner_uid);
		$channel->owner_info = $studio;
        $channel->studio = [
            'id'=>$channel->owner_uid,
            'nickName'=>$studio['nickname'],
            'studioName'=>$studio['username'],
            'avastar'=>'',
            'owner' => [
                'id'=>$channel->owner_uid,
                'nickName'=>$studio['nickname'],
                'userName'=>$studio['username'],
                'avastar'=>'',
            ]
        ];
		return $this->ok($channel);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Channel  $channel
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Channel $channel)
    {
        //鉴权
        $user = AuthApi::current($request);
        if($user && $channel->owner_uid === $user["user_uid"]){
            $channel->name = $request->get('name');
            $channel->type = $request->get('type');
            $channel->summary = $request->get('summary');
            $channel->lang = $request->get('lang');
            $channel->status = $request->get('status');
            $channel->save();
            return $this->ok($channel);
        }else{
            //非所有者鉴权失败
            //TODO 判断是否为协作
            return $this->error(__('auth.failed'));
        }

    }

    /**
     * Remove the specified resource from storage.
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Channel  $channel
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request,Channel $channel)
    {
        //
        $user = AuthApi::current($request);
        if(!$user){
            return $this->error(__('auth.failed'));
        }
        //判断当前用户是否有指定的studio的权限
        if($user['user_uid'] !== $channel->owner_uid){
            return $this->error(__('auth.failed'));
        }
        //查询其他资源
        if(Sentence::where("channel_uid",$channel->uid)->exists()){
            return $this->error("译文有数据无法删除");
        }
        if(DhammaTerm::where("channal",$channel->uid)->exists()){
            return $this->error("术语有数据无法删除");
        }
        if(WbwBlock::where("channel_uid",$channel->uid)->exists()){
            return $this->error("逐词解析有数据无法删除");
        }
        $delete = 0;
        DB::transaction(function() use($channel,$delete){
            //TODO 删除相关资源
            $delete = $channel->delete();
        });

        return $this->ok($delete);
    }
}
