<?php
//JSONを受け取り、CSVを保存し、JSONを返す
ini_set('display_errors',1);
//$data = file_get_contents('php://input');
if($_SERVER['REQUEST_METHOD'] == 'POST'){
	$oriData = file_get_contents('php://input');
	$contents = json_decode($oriData, true);
	if($contents === null){
		throw new Exception('invalid json');
	}
	$fileName = $contents["fileName"];

	$file = fopen("./data/" . $fileName, "w");
	fwrite($file, json_encode($contents["colorData"], JSON_UNESCAPED_UNICODE));
	fclose($file);
	echo json_encode($contents);
}
?>
