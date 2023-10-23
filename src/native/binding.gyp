{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "./addon.cc", "./MurmurHash3.cc"],
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
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
    }
  ]
}
