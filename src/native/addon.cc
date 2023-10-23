#include <napi.h>
#include "./MurmurHash3.h"

Napi::Value BytesToLongLongString(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() != 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsArray())
  {
    Napi::TypeError::New(env, "Wrong arguments type").ThrowAsJavaScriptException();
    return env.Null();
  }

  Napi::Array arr = info[0].As<Napi::Array>();
  if (arr.Length() != 8)
  {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  unsigned char chars[8];
  for (unsigned int i = 0; i < 8; i++)
  {
    if (!arr.Get(i).IsNumber())
    {
      Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
      return env.Null();
    }
    chars[i] = arr.Get(i).As<Napi::Number>().Uint32Value();
  }

  long long value = *(((long long *)chars));

  // printf("v: %lld\n", value);

  // long long range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
  char str[24];
  sprintf(str, "%lld", value);

  return Napi::String::New(env, str);
}

Napi::Value Hash64(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();

  if (info.Length() != 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsString())
  {
    Napi::TypeError::New(env, "Wrong arguments type").ThrowAsJavaScriptException();
    return env.Null();
  }

  Napi::String key = info[0].As<Napi::String>();

  long long out[2];
  
  const std::string str = key.Utf8Value();
  int length = str.length();

  MurmurHash3_x64_128((void *)str.c_str(), length, 0, &out);

  // long long range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
  char str0[24];
  char str1[24];

  sprintf(str0, "%lld", out[0]);
  sprintf(str1, "%lld", out[1]);

  Napi::Array array = Napi::Array::New(env, 2);

  array.Set((uint32_t)0, Napi::String::New(env, str0));
  array.Set((uint32_t)1, Napi::String::New(env, str1));

  return array;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  // exports.Set(Napi::String::New(env, "add"), Napi::Function::New(env, Add));
  exports.Set(Napi::String::New(env, "bytesToLongLongString"), Napi::Function::New(env, BytesToLongLongString));
  exports.Set(Napi::String::New(env, "hash64"), Napi::Function::New(env, Hash64));
  return exports;
}

NODE_API_MODULE(addon, Init)
