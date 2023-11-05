# frozen_string_literal: true
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: tulip.proto

require 'google/protobuf'


descriptor_data = "\n\x0btulip.proto\x12\rmint.tulip.v1\"\x93\x01\n\rSearchRequest\x12\x10\n\x08keywords\x18\x01 \x03(\t\x12\x0c\n\x04\x62ook\x18\x02 \x01(\x05\x12\x34\n\x04page\x18\x63 \x01(\x0b\x32!.mint.tulip.v1.SearchRequest.PageH\x00\x88\x01\x01\x1a#\n\x04Page\x12\r\n\x05index\x18\x01 \x01(\x05\x12\x0c\n\x04size\x18\x02 \x01(\x05\x42\x07\n\x05_page\"\xde\x01\n\x0eSearchResponse\x12\x31\n\x05items\x18\x01 \x03(\x0b\x32\".mint.tulip.v1.SearchResponse.Item\x12/\n\x04page\x18\x62 \x01(\x0b\x32!.mint.tulip.v1.SearchRequest.Page\x12\r\n\x05total\x18\x63 \x01(\x05\x1aY\n\x04Item\x12\x0c\n\x04rank\x18\x01 \x01(\x05\x12\x11\n\thighlight\x18\x02 \x01(\t\x12\x0c\n\x04\x62ook\x18\x03 \x01(\x05\x12\x11\n\tparagraph\x18\x04 \x01(\x05\x12\x0f\n\x07\x63ontent\x18\x05 \x01(\t2O\n\x06Search\x12\x45\n\x04Pali\x12\x1c.mint.tulip.v1.SearchRequest\x1a\x1d.mint.tulip.v1.SearchResponse\"\x00\x42\x32\n.com.github.iapt_platform.mint.plugins.tulip.v1P\x01\x62\x06proto3"

pool = Google::Protobuf::DescriptorPool.generated_pool

begin
  pool.add_serialized_file(descriptor_data)
rescue TypeError => e
  # Compatibility code: will be removed in the next major version.
  require 'google/protobuf/descriptor_pb'
  parsed = Google::Protobuf::FileDescriptorProto.decode(descriptor_data)
  parsed.clear_dependency
  serialized = parsed.class.encode(parsed)
  file = pool.add_serialized_file(serialized)
  warn "Warning: Protobuf detected an import path issue while loading generated file #{__FILE__}"
  imports = [
  ]
  imports.each do |type_name, expected_filename|
    import_file = pool.lookup(type_name).file_descriptor
    if import_file.name != expected_filename
      warn "- #{file.name} imports #{expected_filename}, but that import was loaded as #{import_file.name}"
    end
  end
  warn "Each proto file must use a consistent fully-qualified name."
  warn "This will become an error in the next major version."
end

module Mint
  module Tulip
    module V1
      SearchRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("mint.tulip.v1.SearchRequest").msgclass
      SearchRequest::Page = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("mint.tulip.v1.SearchRequest.Page").msgclass
      SearchResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("mint.tulip.v1.SearchResponse").msgclass
      SearchResponse::Item = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("mint.tulip.v1.SearchResponse.Item").msgclass
    end
  end
end
