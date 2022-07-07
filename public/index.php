<?php
$filePath='./index.html';
$configPath='./config.json';
if(file_exists($filePath)===TRUE && file_exists($configPath)===TRUE)
    {
            try
            {
                $strJsonFileContents = file_get_contents($configPath);
                $json_a = json_decode($strJsonFileContents, true);
                $fileContent = file_get_contents($filePath);
                $fileContent = str_replace('__SERVER_DATA__', $strJsonFileContents, $fileContent);
                $fileContent = preg_replace('/(<base\b[^><]*)>/i', '<base href="'.$json_a['Config']['baseUrl'].'">', $fileContent);
                
                echo $fileContent;
            }
            catch(Exception $e)
            {
            }
    }
?>