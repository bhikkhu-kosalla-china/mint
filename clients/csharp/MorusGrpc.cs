// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: morus.proto
// </auto-generated>
#pragma warning disable 0414, 1591, 8981, 0612
#region Designer generated code

using grpc = global::Grpc.Core;

namespace Mint.Morus.V1 {
  /// <summary>
  /// ----------------------------------------------------------------------------
  /// </summary>
  public static partial class Markdown
  {
    static readonly string __ServiceName = "mint.morus.v1.Markdown";

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static void __Helper_SerializeMessage(global::Google.Protobuf.IMessage message, grpc::SerializationContext context)
    {
      #if !GRPC_DISABLE_PROTOBUF_BUFFER_SERIALIZATION
      if (message is global::Google.Protobuf.IBufferMessage)
      {
        context.SetPayloadLength(message.CalculateSize());
        global::Google.Protobuf.MessageExtensions.WriteTo(message, context.GetBufferWriter());
        context.Complete();
        return;
      }
      #endif
      context.Complete(global::Google.Protobuf.MessageExtensions.ToByteArray(message));
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static class __Helper_MessageCache<T>
    {
      public static readonly bool IsBufferMessage = global::System.Reflection.IntrospectionExtensions.GetTypeInfo(typeof(global::Google.Protobuf.IBufferMessage)).IsAssignableFrom(typeof(T));
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static T __Helper_DeserializeMessage<T>(grpc::DeserializationContext context, global::Google.Protobuf.MessageParser<T> parser) where T : global::Google.Protobuf.IMessage<T>
    {
      #if !GRPC_DISABLE_PROTOBUF_BUFFER_SERIALIZATION
      if (__Helper_MessageCache<T>.IsBufferMessage)
      {
        return parser.ParseFrom(context.PayloadAsReadOnlySequence());
      }
      #endif
      return parser.ParseFrom(context.PayloadAsNewBuffer());
    }

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::Mint.Morus.V1.MarkdownToHtmlRequest> __Marshaller_mint_morus_v1_MarkdownToHtmlRequest = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::Mint.Morus.V1.MarkdownToHtmlRequest.Parser));
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Marshaller<global::Mint.Morus.V1.MarkdownToHtmlResponse> __Marshaller_mint_morus_v1_MarkdownToHtmlResponse = grpc::Marshallers.Create(__Helper_SerializeMessage, context => __Helper_DeserializeMessage(context, global::Mint.Morus.V1.MarkdownToHtmlResponse.Parser));

    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    static readonly grpc::Method<global::Mint.Morus.V1.MarkdownToHtmlRequest, global::Mint.Morus.V1.MarkdownToHtmlResponse> __Method_ToHtml = new grpc::Method<global::Mint.Morus.V1.MarkdownToHtmlRequest, global::Mint.Morus.V1.MarkdownToHtmlResponse>(
        grpc::MethodType.Unary,
        __ServiceName,
        "ToHtml",
        __Marshaller_mint_morus_v1_MarkdownToHtmlRequest,
        __Marshaller_mint_morus_v1_MarkdownToHtmlResponse);

    /// <summary>Service descriptor</summary>
    public static global::Google.Protobuf.Reflection.ServiceDescriptor Descriptor
    {
      get { return global::Mint.Morus.V1.MorusReflection.Descriptor.Services[0]; }
    }

    /// <summary>Base class for server-side implementations of Markdown</summary>
    [grpc::BindServiceMethod(typeof(Markdown), "BindService")]
    public abstract partial class MarkdownBase
    {
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::System.Threading.Tasks.Task<global::Mint.Morus.V1.MarkdownToHtmlResponse> ToHtml(global::Mint.Morus.V1.MarkdownToHtmlRequest request, grpc::ServerCallContext context)
      {
        throw new grpc::RpcException(new grpc::Status(grpc::StatusCode.Unimplemented, ""));
      }

    }

    /// <summary>Client for Markdown</summary>
    public partial class MarkdownClient : grpc::ClientBase<MarkdownClient>
    {
      /// <summary>Creates a new client for Markdown</summary>
      /// <param name="channel">The channel to use to make remote calls.</param>
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public MarkdownClient(grpc::ChannelBase channel) : base(channel)
      {
      }
      /// <summary>Creates a new client for Markdown that uses a custom <c>CallInvoker</c>.</summary>
      /// <param name="callInvoker">The callInvoker to use to make remote calls.</param>
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public MarkdownClient(grpc::CallInvoker callInvoker) : base(callInvoker)
      {
      }
      /// <summary>Protected parameterless constructor to allow creation of test doubles.</summary>
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      protected MarkdownClient() : base()
      {
      }
      /// <summary>Protected constructor to allow creation of configured clients.</summary>
      /// <param name="configuration">The client configuration.</param>
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      protected MarkdownClient(ClientBaseConfiguration configuration) : base(configuration)
      {
      }

      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::Mint.Morus.V1.MarkdownToHtmlResponse ToHtml(global::Mint.Morus.V1.MarkdownToHtmlRequest request, grpc::Metadata headers = null, global::System.DateTime? deadline = null, global::System.Threading.CancellationToken cancellationToken = default(global::System.Threading.CancellationToken))
      {
        return ToHtml(request, new grpc::CallOptions(headers, deadline, cancellationToken));
      }
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual global::Mint.Morus.V1.MarkdownToHtmlResponse ToHtml(global::Mint.Morus.V1.MarkdownToHtmlRequest request, grpc::CallOptions options)
      {
        return CallInvoker.BlockingUnaryCall(__Method_ToHtml, null, options, request);
      }
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual grpc::AsyncUnaryCall<global::Mint.Morus.V1.MarkdownToHtmlResponse> ToHtmlAsync(global::Mint.Morus.V1.MarkdownToHtmlRequest request, grpc::Metadata headers = null, global::System.DateTime? deadline = null, global::System.Threading.CancellationToken cancellationToken = default(global::System.Threading.CancellationToken))
      {
        return ToHtmlAsync(request, new grpc::CallOptions(headers, deadline, cancellationToken));
      }
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      public virtual grpc::AsyncUnaryCall<global::Mint.Morus.V1.MarkdownToHtmlResponse> ToHtmlAsync(global::Mint.Morus.V1.MarkdownToHtmlRequest request, grpc::CallOptions options)
      {
        return CallInvoker.AsyncUnaryCall(__Method_ToHtml, null, options, request);
      }
      /// <summary>Creates a new instance of client from given <c>ClientBaseConfiguration</c>.</summary>
      [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
      protected override MarkdownClient NewInstance(ClientBaseConfiguration configuration)
      {
        return new MarkdownClient(configuration);
      }
    }

    /// <summary>Creates service definition that can be registered with a server</summary>
    /// <param name="serviceImpl">An object implementing the server-side handling logic.</param>
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    public static grpc::ServerServiceDefinition BindService(MarkdownBase serviceImpl)
    {
      return grpc::ServerServiceDefinition.CreateBuilder()
          .AddMethod(__Method_ToHtml, serviceImpl.ToHtml).Build();
    }

    /// <summary>Register service method with a service binder with or without implementation. Useful when customizing the service binding logic.
    /// Note: this method is part of an experimental API that can change or be removed without any prior notice.</summary>
    /// <param name="serviceBinder">Service methods will be bound by calling <c>AddMethod</c> on this object.</param>
    /// <param name="serviceImpl">An object implementing the server-side handling logic.</param>
    [global::System.CodeDom.Compiler.GeneratedCode("grpc_csharp_plugin", null)]
    public static void BindService(grpc::ServiceBinderBase serviceBinder, MarkdownBase serviceImpl)
    {
      serviceBinder.AddMethod(__Method_ToHtml, serviceImpl == null ? null : new grpc::UnaryServerMethod<global::Mint.Morus.V1.MarkdownToHtmlRequest, global::Mint.Morus.V1.MarkdownToHtmlResponse>(serviceImpl.ToHtml));
    }

  }
}
#endregion