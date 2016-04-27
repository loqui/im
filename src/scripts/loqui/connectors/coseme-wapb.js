var _root = dcodeIO.ProtoBuf.newBuilder({})['import']({
    "package": "com.whatsapp.proto",
    "messages": [
        {
            "name": "Message",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "conversation",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "SenderKeyDistributionMessage",
                    "name": "sender_key_distribution_message",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "ImageMessage",
                    "name": "image_message",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "ContactMessage",
                    "name": "contact_message",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "LocationMessage",
                    "name": "location_message",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "UrlMessage",
                    "name": "url_message",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "DocumentMessage",
                    "name": "document_message",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "AudioMessage",
                    "name": "audio_message",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "VideoMessage",
                    "name": "video_message",
                    "id": 9
                }
            ]
        },
        {
            "name": "SenderKeyDistributionMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "groupId",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "axolotl_sender_key_distribution_message",
                    "id": 2
                }
            ]
        },
        {
            "name": "ImageMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "url",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mime_type",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "caption",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "file_sha256",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "file_length",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "height",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "width",
                    "id": 7
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "media_key",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "jpeg_thumbnail",
                    "id": 16
                }
            ]
        },
        {
            "name": "LocationMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "double",
                    "name": "degrees_latitude",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "double",
                    "name": "degrees_longitude",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "name",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "address",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "url",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "jpeg_thumbnail",
                    "id": 16
                }
            ]
        },
        {
            "name": "DocumentMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "url",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mime_type",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "title",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "file_sha256",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "file_length",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "page_count",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "media_key",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "jpeg_thumbnail",
                    "id": 16
                }
            ]
        },
        {
            "name": "UrlMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "text",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "matched_text",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "canonical_url",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "description",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "title",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "jpeg_thumbnail",
                    "id": 16
                }
            ]
        },
        {
            "name": "AudioMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "url",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mime_type",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "file_sha256",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "file_length",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "duration",
                    "id": 5
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "unk",
                    "id": 6
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "media_key",
                    "id": 7
                }
            ]
        },
        {
            "name": "VideoMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "url",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "mime_type",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "file_sha256",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "file_length",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "duration",
                    "id": 5
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "media_key",
                    "id": 6
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "caption",
                    "id": 7
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "jpeg_thumbnail",
                    "id": 16
                }
            ]
        },
        {
            "name": "ContactMessage",
            "fields": [
                {
                    "rule": "required",
                    "type": "string",
                    "name": "display_name",
                    "id": 1
                },
                {
                    "rule": "required",
                    "type": "string",
                    "name": "vcard",
                    "id": 16
                }
            ]
        }
    ]
}).build();
