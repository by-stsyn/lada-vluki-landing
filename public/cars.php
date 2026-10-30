<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$url = 'https://carsinstok.onrender.com/api/cars';
$cacheFile = sys_get_temp_dir() . '/lada_vluki_cars_cache.json';
$cacheTtl = 3600; // 1 час серверного кэша на Reg.ru

// 1. Отдаем свежий серверный кэш мгновенно (за < 5 мс)
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTtl)) {
    $cachedData = @file_get_contents($cacheFile);
    if ($cachedData && strlen($cachedData) > 10) {
        header('X-Feed-Cache: HIT');
        echo $cachedData;
        exit;
    }
}

// 2. Запрашиваем данные с источника (с запасом времени на пробуждение Render)
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_TIMEOUT, 25);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; LadaVlukiProxy/1.0)');

$data = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Проверяем, что пришел валидный JSON-массив
$decoded = $data ? json_decode($data, true) : null;

if ($data !== false && $httpCode === 200 && is_array($decoded)) {
    @file_put_contents($cacheFile, $data);
    header('X-Feed-Cache: MISS');
    echo $data;
    exit;
}

// 3. Резервный возврат устаревшего кэша, если внешний сервер временно недоступен
if (file_exists($cacheFile)) {
    $staleData = @file_get_contents($cacheFile);
    if ($staleData && strlen($staleData) > 10) {
        header('X-Feed-Cache: STALE');
        echo $staleData;
        exit;
    }
}

http_response_code(502);
echo json_encode(['error' => 'Failed to fetch car feed']);
?>
