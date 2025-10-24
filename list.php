<?php
// Devuelve un JSON con la estructura de carpetas y archivos dentro de 'fts centenario'
header('Content-Type: application/json; charset=utf-8');
$base = 'fts centenario';
$result = [];

if (!is_dir($base)) {
	// Carpeta no encontrada: devolver objeto vacío
	echo json_encode($result, JSON_UNESCAPED_UNICODE);
	exit;
}

$entries = array_values(array_diff(scandir($base), ['.', '..']));
foreach ($entries as $entry) {
	$path = $base . DIRECTORY_SEPARATOR . $entry;
	if (is_dir($path)) {
		// Listar solo archivos en esta subcarpeta
		$files = array_values(array_filter(scandir($path), function($f) use ($path) {
			return $f !== '.' && $f !== '..' && is_file($path . DIRECTORY_SEPARATOR . $f);
		}));
		if (count($files) > 0) {
			$result[$entry] = $files;
		}
	} else {
		// Archivo en la raíz de 'fts centenario' -> agrupar en 'Otras Fotografías'
		if (!isset($result['Otras Fotografías'])) $result['Otras Fotografías'] = [];
		$result['Otras Fotografías'][] = $entry;
	}
}

// Devolver sin escapar unicode para mantener acentos en los nombres
echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>