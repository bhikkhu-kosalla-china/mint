<?php
//header('Content-type: application/json; charset=utf8');

require_once "../path.php";
require_once "../sync/function.php";

$input = (object) [
    "database" =>  _FILE_DB_USER_WBW_,
    "table" =>  "wbw",
    "uuid" =>  "id",
    "modify_time" =>  "modify_time",
    "receive_time" =>  "receive_time",
    "insert" => [
        "id",
        "parent_id",
        "book",
        "paragraph",
        "owner",
        "lang",
        "author",
        "editor",
        "tag",
        "status",
        "modify_time",
        "receive_time"
    ],
    "update" =>  [
        "lang",
        "author",
        "editor",
        "tag",
        "status",
        "receive_time"
    ]    
];

do_sync($input);

?>