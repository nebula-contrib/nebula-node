{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "native/addon.cc", "native/MurmurHash3.cc"],
      "cflags!": [ 
        "-fno-exceptions", 
        "-Wno-implicit-fallthrough", 
        "-Wno-unused-result",
        "-Wno-cast-function-type",
        "-Wno-attributes"
      ],
      "cflags_cc!": [ 
        "-fno-exceptions", 
        "-Wno-implicit-fallthrough", 
        "-Wno-unused-result",
        "-Wno-cast-function-type",
        "-Wno-attributes"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }
  ]
}
