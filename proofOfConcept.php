<?php

echo "<pre>";
if(!empty($_FILES)){
    echo "<br>FILES:<hr>";
    print_r($_FILES);
}
if(!empty($_POST)){
    echo "<br>POST:<hr>";
    print_r($_POST);
}
if(!empty($_GET)){
    echo "<br>GET:<hr>";
    print_r($_GET);
}