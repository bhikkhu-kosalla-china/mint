<?php
require_once "../path.php";
require_once "../public/_pdo.php";
require_once "../public/function.php";
require_once '../ucenter/setting_function.php';

if (isset($_GET["book"])) {
    $in_book = $_GET["book"];
}
if (isset($_GET["paragraph"])) {
    $in_para = $_GET["paragraph"];
}
if (isset($_GET["sn"])) {
    $in_sn = $_GET["sn"];
}
if (isset($_GET["type"])) {
    $type = $_GET["type"];
} else {
    $type = "wbw";
}
if (isset($_GET["dict_name"])) {
    $dict_name = $_GET["dict_name"];
} else {
    $dict_name = "";
}
if ($type == "part") {
    $lookup_loop = 3;
} else {
    $lookup_loop = 3;
}
if (isset($_GET["deep"])) {
    $lookup_loop = $_GET["deep"];
} else {
    $lookup_loop = 3;
}
$in_word = $_GET["word"];
if (isset($_GET["debug"])) {
    $debug = true;
} else {
    $debug = false;
}

if (mb_strlen($in_word) == 0) {
    exit;
}

function microtime_float()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((float) $usec + (float) $sec);
}

$time_start = microtime_float();

$user_setting = get_setting();

//open database

global $PDO;
$word_list = str_getcsv($in_word);

$dict_word_spell = array();
$output = array();
$db_file_list = array();
//用户词典
if ($dict_name == "") {
    array_push($db_file_list, _FILE_DB_WBW_);

    array_push($db_file_list, _DIR_DICT_SYSTEM_ . "/sys_regular.db");
    array_push($db_file_list, _DIR_DICT_SYSTEM_ . "/sys_irregular.db");
    array_push($db_file_list, _DIR_DICT_SYSTEM_ . "/union.db");
    array_push($db_file_list, _DIR_DICT_SYSTEM_ . "/comp.db");

    array_push($db_file_list, _DIR_DICT_3RD_ . "/pm.db");
    array_push($db_file_list, _DIR_DICT_3RD_ . "/bhmf.db");
    array_push($db_file_list, _DIR_DICT_3RD_ . "/shuihan.db");
    array_push($db_file_list, _DIR_DICT_3RD_ . "/concise.db");
    array_push($db_file_list, _DIR_DICT_3RD_ . "/uhan_en.db");
} else {
    $dict_list = str_getcsv($dict_name, ',');
    foreach ($dict_list as $dict) {
        array_push($db_file_list, $dict);
    }
}

$_dict_db = array();
foreach ($db_file_list as $db_file) {
    try {
        $dbh = new PDO("" . $db_file, "", "");
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        $_dict_db[] = array("file" => $db_file, "dbh" => $dbh);

    } catch (PDOException $e) {
        if ($debug) {
            print "Error!: " . $e->getMessage() . "<br/>";
        }
    }
}

for ($i = 0; $i < $lookup_loop; $i++) {
    $parent_list = array();
    $strQueryWord = "("; //单词查询字串
    foreach ($word_list as $word) {
        $word = str_replace("'", "’", $word);
        $strQueryWord .= "'{$word}',";
    }
    $strQueryWord = mb_substr($strQueryWord, 0, mb_strlen($strQueryWord, "UTF-8") - 1, "UTF-8");
    $strQueryWord .= ")";
    if ($debug) {
        echo "<h2>第" . ($i + 1) . "轮查询：" . count($word_list) . "</h2>";
    }
    foreach ($_dict_db as $db_file) {
        if ($debug) {
            echo "dict connect:{$db_file["file"]}<br>";
        }
        if ($i == 0) {
            $query = "select * from dict where \"pali\" in $strQueryWord ORDER BY rowid DESC";
        } else {
            $query = "select * from dict where  \"pali\" in $strQueryWord  AND ( type <> '.n.' AND  type <> '.ti.' AND  type <> '.adj.'  AND  type <> '.pron.'  AND  type <> '.v.' )   ORDER BY rowid DESC";
        }
        if ($debug) {
            echo $query . "<br>";
        }
        if ($db_file["dbh"]) {
            try {
                $stmt = $db_file["dbh"]->query($query);
                if ($stmt) {
                    $Fetch = $stmt->fetchAll(PDO::FETCH_ASSOC);
                } else {
                    $Fetch = array();
                    if ($debug) {
                        echo "无效的Statement句柄";
                    }
                }
            } catch (PDOException $e) {
                if ($debug) {
                    print "Error!: " . $e->getMessage() . "<br/>";
                }
                $Fetch = array();
            }
        } else {
            $Fetch = array();
            if ($debug) {
                echo "无效的数据库句柄";
            }
        }
        //$Fetch = PDO_FetchAll($query);
        $iFetch = count($Fetch);
        if ($debug) {
            echo "count:$iFetch<br>";
        }
        if ($iFetch > 0) {
            foreach ($Fetch as $one) {
                $id = $one["id"];
                if (isset($one["guid"])) {
                    $guid = $one["guid"];
                } else {
                    $guid = "";
                }
                if (isset($one["lang"])) {
                    $language = $one["lang"];
                } else if (isset($one["language"])) {
                    $language = $one["language"];
                } else {
                    $language = "en";
                }

                $pali = $one["pali"];
                $dict_word_spell["{$pali}"] = 1;
                $type = $one["type"];
                $gramma = $one["gramma"];
                $parent = $one["parent"];
                //$mean = $one["mean"];

                if (inLangSetting($language, $user_setting["dict.lang"])) {
                    $mean = $one["mean"];
                } else {
                    $mean = "";
                }

                $note = $one["note"];
                if (isset($one["factors"])) {
                    $parts = $one["factors"];
                } else if (isset($one["parts"])) {
                    $parts = $one["parts"];
                } else {
                    $parts = "";
                }

                if (isset($one["factormean"])) {
                    $partmean = $one["factormean"];
                } else if (isset($one["partmean"])) {
                    $partmean = $one["partmean"];
                } else {
                    $partmean = "";
                }

                if (inLangSetting($language, $user_setting["dict.lang"]) == false) {
                    $partmean = "";
                }

                $status = $one["status"];
                if (isset($one["confidence"])) {
                    $confidence = $one["confidence"];
                } else {
                    $confidence = 100;
                }

                if (isset($one["dict_name"])) {
                    $dict_name = $one["dict_name"];
                } else {
                    $dict_name = "";
                }

                array_push($output, array(
                    "id" => $id,
                    "guid" => $guid,
                    "pali" => $pali,
                    "type" => $type,
                    "gramma" => $gramma,
                    "parent" => $parent,
                    "mean" => $mean,
                    "note" => $note,
                    "parts" => $parts,
                    "partmean" => $partmean,
                    "status" => $status,
                    "confidence" => $confidence,
                    "dict_name" => $dict_name,
                    "language" => $language,
                ));
                //将语基插入下次查询的列表
                if (!empty($parent)) {
                    if ($pali != $parent) {
                        $parent_list[$parent] = 1;
                    }
                }
                //将拆分插入下次查询的列表
                if ($type != ".part.") {
                    if (!empty($parts)) {
                        $wordparts = str_getcsv($parts, '+');
                        foreach ($wordparts as $x) {
                            if (!empty($x)) {
                                if ($x != $pali) {
                                    $parent_list[$x] = 1;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /*
    if($i==0){
    //自动查找单词词干
    $word_base=getPaliWordBase($in_word);
    foreach($word_base as $x=>$infolist){
    foreach($infolist as $gramma){
    array_push($output,
    array("pali"=>$in_word,
    "parent"=>$x,
    "type"=>$gramma["type"],
    "gramma"=>$gramma["gramma"],
    "parts"=>$gramma["parts"],
    "partmean"=>"",
    "mean"=>"",
    "language"=>"en",
    "dict_name"=>"auto",
    "status"=>128
    ));
    $part_list=str_getcsv($gramma["parts"],"+");
    foreach($part_list as $part){
    $parent_list[$part]=1;
    }
    }
    }
    }
     */
    if ($debug) {
        echo "parent:" . count($parent_list) . "<br>";
        print_r($parent_list) . "<br>";
    }
    if (count($parent_list) == 0) {
        break;
    } else {
        $word_list = array();
        foreach ($parent_list as $x => $value) {
            array_push($word_list, $x);
        }
    }

}
//删除无效数据
$newOutput = array();
foreach ($output as $value) {
    if ($value["dict_name"] == "auto") {
        if (isset($dict_word_spell["{$value["parent"]}"])) {
            array_push($newOutput, $value);
        }
    } else {
        array_push($newOutput, $value);
    }
}

if ($debug) {
    echo "<textarea width=\"100%\" >";
}
echo json_encode($newOutput, JSON_UNESCAPED_UNICODE);
if ($debug) {
    echo "</textarea>";
}
if ($debug) {
    echo "生成：" . count($output) . "<br>";
    echo "有效：" . count($newOutput) . "<br>";
    foreach ($newOutput as $result) {
        echo "{$result["pali"]}-{$result["parent"]}-{$result["mean"]}<br>";
    }
    $queryTime = (microtime_float() - $time_start) * 1000;
    echo "<div >搜索时间：$queryTime 毫秒</div>";
}
