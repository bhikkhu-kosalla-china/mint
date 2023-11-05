// Generated by the gRPC C++ plugin.
// If you make any local change, they will be lost.
// source: tulip.proto

#include "tulip.pb.h"
#include "tulip.grpc.pb.h"

#include <functional>
#include <grpcpp/support/async_stream.h>
#include <grpcpp/support/async_unary_call.h>
#include <grpcpp/impl/channel_interface.h>
#include <grpcpp/impl/client_unary_call.h>
#include <grpcpp/support/client_callback.h>
#include <grpcpp/support/message_allocator.h>
#include <grpcpp/support/method_handler.h>
#include <grpcpp/impl/rpc_service_method.h>
#include <grpcpp/support/server_callback.h>
#include <grpcpp/impl/server_callback_handlers.h>
#include <grpcpp/server_context.h>
#include <grpcpp/impl/service_type.h>
#include <grpcpp/support/sync_stream.h>
namespace mint {
namespace tulip {
namespace v1 {

static const char* Search_method_names[] = {
  "/mint.tulip.v1.Search/Pali",
};

std::unique_ptr< Search::Stub> Search::NewStub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options) {
  (void)options;
  std::unique_ptr< Search::Stub> stub(new Search::Stub(channel, options));
  return stub;
}

Search::Stub::Stub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options)
  : channel_(channel), rpcmethod_Pali_(Search_method_names[0], options.suffix_for_stats(),::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  {}

::grpc::Status Search::Stub::Pali(::grpc::ClientContext* context, const ::mint::tulip::v1::SearchRequest& request, ::mint::tulip::v1::SearchResponse* response) {
  return ::grpc::internal::BlockingUnaryCall< ::mint::tulip::v1::SearchRequest, ::mint::tulip::v1::SearchResponse, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), rpcmethod_Pali_, context, request, response);
}

void Search::Stub::async::Pali(::grpc::ClientContext* context, const ::mint::tulip::v1::SearchRequest* request, ::mint::tulip::v1::SearchResponse* response, std::function<void(::grpc::Status)> f) {
  ::grpc::internal::CallbackUnaryCall< ::mint::tulip::v1::SearchRequest, ::mint::tulip::v1::SearchResponse, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_Pali_, context, request, response, std::move(f));
}

void Search::Stub::async::Pali(::grpc::ClientContext* context, const ::mint::tulip::v1::SearchRequest* request, ::mint::tulip::v1::SearchResponse* response, ::grpc::ClientUnaryReactor* reactor) {
  ::grpc::internal::ClientCallbackUnaryFactory::Create< ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_Pali_, context, request, response, reactor);
}

::grpc::ClientAsyncResponseReader< ::mint::tulip::v1::SearchResponse>* Search::Stub::PrepareAsyncPaliRaw(::grpc::ClientContext* context, const ::mint::tulip::v1::SearchRequest& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderHelper::Create< ::mint::tulip::v1::SearchResponse, ::mint::tulip::v1::SearchRequest, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), cq, rpcmethod_Pali_, context, request);
}

::grpc::ClientAsyncResponseReader< ::mint::tulip::v1::SearchResponse>* Search::Stub::AsyncPaliRaw(::grpc::ClientContext* context, const ::mint::tulip::v1::SearchRequest& request, ::grpc::CompletionQueue* cq) {
  auto* result =
    this->PrepareAsyncPaliRaw(context, request, cq);
  result->StartCall();
  return result;
}

Search::Service::Service() {
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      Search_method_names[0],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< Search::Service, ::mint::tulip::v1::SearchRequest, ::mint::tulip::v1::SearchResponse, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(
          [](Search::Service* service,
             ::grpc::ServerContext* ctx,
             const ::mint::tulip::v1::SearchRequest* req,
             ::mint::tulip::v1::SearchResponse* resp) {
               return service->Pali(ctx, req, resp);
             }, this)));
}

Search::Service::~Service() {
}

::grpc::Status Search::Service::Pali(::grpc::ServerContext* context, const ::mint::tulip::v1::SearchRequest* request, ::mint::tulip::v1::SearchResponse* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}


}  // namespace mint
}  // namespace tulip
}  // namespace v1

