<?php

namespace App\Http\Controllers;

use App\Models\ArticleCollection;
use Illuminate\Http\Request;
use App\Http\Resources\ArticleMapResource;

class ArticleMapController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        switch ($request->get('view')) {
            case 'anthology':
                $table = ArticleCollection::where('collect_id',$request->get('id'));
                break;
            case 'article':
                $table = ArticleCollection::where('article_id',$request->get('id'));
                break;
        }
        $result = $table->select(['id','collect_id','article_id','level','title','children'])->orderBy('id')->get();
        return $this->ok(["rows"=>ArticleMapResource::collection($result),"count"=>count($result)]);
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
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ArticleCollection  $articleCollection
     * @return \Illuminate\Http\Response
     */
    public function show(ArticleCollection $articleCollection)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ArticleCollection  $articleCollection
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ArticleCollection $articleCollection)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ArticleCollection  $articleCollection
     * @return \Illuminate\Http\Response
     */
    public function destroy(ArticleCollection $articleCollection)
    {
        //
    }
}