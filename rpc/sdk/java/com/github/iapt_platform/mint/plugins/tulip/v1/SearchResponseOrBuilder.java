// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: tulip.proto

package com.github.iapt_platform.mint.plugins.tulip.v1;

public interface SearchResponseOrBuilder extends
    // @@protoc_insertion_point(interface_extends:mint.tulip.v1.SearchResponse)
    com.google.protobuf.MessageOrBuilder {

  /**
   * <code>repeated .mint.tulip.v1.SearchResponse.Item items = 1;</code>
   */
  java.util.List<com.github.iapt_platform.mint.plugins.tulip.v1.SearchResponse.Item> 
      getItemsList();
  /**
   * <code>repeated .mint.tulip.v1.SearchResponse.Item items = 1;</code>
   */
  com.github.iapt_platform.mint.plugins.tulip.v1.SearchResponse.Item getItems(int index);
  /**
   * <code>repeated .mint.tulip.v1.SearchResponse.Item items = 1;</code>
   */
  int getItemsCount();
  /**
   * <code>repeated .mint.tulip.v1.SearchResponse.Item items = 1;</code>
   */
  java.util.List<? extends com.github.iapt_platform.mint.plugins.tulip.v1.SearchResponse.ItemOrBuilder> 
      getItemsOrBuilderList();
  /**
   * <code>repeated .mint.tulip.v1.SearchResponse.Item items = 1;</code>
   */
  com.github.iapt_platform.mint.plugins.tulip.v1.SearchResponse.ItemOrBuilder getItemsOrBuilder(
      int index);

  /**
   * <code>.mint.tulip.v1.SearchRequest.Page page = 98;</code>
   * @return Whether the page field is set.
   */
  boolean hasPage();
  /**
   * <code>.mint.tulip.v1.SearchRequest.Page page = 98;</code>
   * @return The page.
   */
  com.github.iapt_platform.mint.plugins.tulip.v1.SearchRequest.Page getPage();
  /**
   * <code>.mint.tulip.v1.SearchRequest.Page page = 98;</code>
   */
  com.github.iapt_platform.mint.plugins.tulip.v1.SearchRequest.PageOrBuilder getPageOrBuilder();

  /**
   * <code>int32 total = 99;</code>
   * @return The total.
   */
  int getTotal();
}
