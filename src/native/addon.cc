/**
 * Created by Wu Jian Ping on - 2021/06/15.
 */

#include <node.h>
#include "./MurmurHash3.h"

namespace addon
{
  using v8::Array;
  using v8::Context;
  using v8::Exception;
  using v8::Function;
  using v8::FunctionCallbackInfo;
  using v8::Integer;
  using v8::Isolate;
  using v8::Local;
  using v8::Null;
  using v8::Number;
  using v8::Object;
  using v8::String;
  using v8::Undefined;
  using v8::Value;

  void BytesToLongLongString(const FunctionCallbackInfo<Value> &args)
  {
    Isolate *isolate = args.GetIsolate();

    unsigned char b0 = args[0].As<Number>()->Value();
    unsigned char b1 = args[1].As<Number>()->Value();
    unsigned char b2 = args[2].As<Number>()->Value();
    unsigned char b3 = args[3].As<Number>()->Value();
    unsigned char b4 = args[4].As<Number>()->Value();
    unsigned char b5 = args[5].As<Number>()->Value();
    unsigned char b6 = args[6].As<Number>()->Value();
    unsigned char b7 = args[7].As<Number>()->Value();

    unsigned char chars[8] = {b0, b1, b2, b3, b4, b5, b6, b7};

    long long value = *(((long long *)chars));

    // printf("v: %lld\n", value);

    // long long range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
    char str[24];
    sprintf(str, "%lld", value);

    args.GetReturnValue().Set(String::NewFromUtf8(
                                  isolate, str)
                                  .ToLocalChecked());
  }

  void Hash64(const FunctionCallbackInfo<Value> &args)
  {
    Isolate *isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    long long out[2];

    Local<String> key = Local<String>::Cast(args[0]);

    v8::String::Utf8Value str(isolate, key);

    char *c_str = *str;
    int length = strlen(c_str);

    MurmurHash3_x64_128((void *)c_str, length, 0, &out);

    // long long range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
    char str0[24];
    char str1[24];

    sprintf(str0, "%lld", out[0]);
    sprintf(str1, "%lld", out[1]);

    Local<Array> array = Array::New(isolate, 2);
    array->Set(context, Integer::New(isolate, 0), String::NewFromUtf8(isolate, str0).ToLocalChecked());
    array->Set(context, Integer::New(isolate, 1), String::NewFromUtf8(isolate, str1).ToLocalChecked());
    args.GetReturnValue().Set(array);
  }

  // setup exports
  void Init(Local<Object> exports)
  {
    NODE_SET_METHOD(exports, "bytesToLongLongString", BytesToLongLongString);
    NODE_SET_METHOD(exports, "hash64", Hash64);
  }

  // init module
  // 下面这种方式在worker里面报Module did not self-register错误
  // NODE_MODULE(NODE_GYP_MODULE_NAME, Init)
  NODE_MODULE_INIT()
  {
    Init(exports);
  }
}
