<?php
require_once "../public/load_lang.php";
require_once "../path.php";
require_once "../pcdl/html_head.php";
?>
<body style="margin: 0;padding: 0;" class="reader_body" >
<script src="../nissaya/nissaya.js"></script>
<style>
.img_box{
	background-color:gray;
}
.book_page{
	display: inline-block;
    background-color: blue;
    max-width: 100%;
    width: 100vw;	
}
</style>
<?php
if(isset($_GET["book"])){
	$book = $_GET["book"];
}
else{
	$book = 0;
}
if(isset($_GET["para"])){
	$para = $_GET["para"];
}
else{
	$para = 0;
}
if(isset($_GET["begin"])){
	$begin = $_GET["begin"];
}
else{
	$begin = 0;
}
if(isset($_GET["end"])){
	$end = $_GET["end"];
}
else{
	$end = 0;
}
?>
<script>
$(document).ready(function () {
	nissaya_get(<?php echo "{$book},{$para},{$begin},{$end}";?>);
});
</script>

<div id="contence">
</div>
	</body>
</html>