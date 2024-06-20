eruda.init();

Telegram.WebApp.expand();


/*Telegram.WebApp.MainButton.disable();

 //Показать основную кнопку
Telegram.WebApp.MainButton.setParams({
    is_visible: false,
    color: Telegram.WebApp.backgroundColor,
    text: 'Назва'
});
Telegram.WebApp.MainButton.show();
*/
Telegram.WebApp.setHeaderColor('secondary_bg_color');

Telegram.WebApp.onEvent('themeChanged', function() {
    document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
});

const userId = Telegram.WebApp.initDataUnsafe.user.id;

const firebaseConfig = {
    apiKey: "AIzaSyDvM00UOR58dhEYUnygb0iTuykeGL-uCi0",
    authDomain: "mini-apps-9f87a.firebaseapp.com",
    databaseURL: "https://mini-apps-9f87a-default-rtdb.firebaseio.com",
    projectId: "mini-apps-9f87a",
    storageBucket: "mini-apps-9f87a.appspot.com",
    messagingSenderId: "465758969756",
    appId: "1:465758969756:web:daed11b8eb637da550b259"
};

    // Инициализация Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
console.log("Firebase initialized with userId:", userId);

function saveQrResult(result) {
    console.log('saveQrResult', result);
    user = userid = "'" + userId + "'";

    var qrData = {
        text: result,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection('users').doc(user).collection('qrHistory').add(qrData)
        .then(() => {
            console.log('QR код успешно сохранен');
        })
        .catch((error) => {
            console.error('Ошибка при сохранении QR кода: ', error);
        });
}
function showNotification(message) {
    const notificationElement = document.getElementById('notification');
    const notificationMessageElement = document.getElementById('notification-message');

    // Устанавливаем текст уведомления
    notificationMessageElement.textContent = message;

    // Показываем уведомление
    notificationElement.style.display = 'flex';
}

// Функция для закрытия уведомления
function closeNotification() {
    const notificationElement = document.getElementById('notification');

    // Скрываем уведомление
    notificationElement.style.display = 'none';
}
// Функция для отображения истории
function toggleHistory() {
    const historyContainer = document.getElementById('history-container');
    historyContainer.style.display = (historyContainer.style.display === 'none') ? 'block' : 'none';

    if (historyContainer.style.display === 'block') {
        showHistory();
    }
}

function toggleDetails(qr) {
    const detailContainer = document.getElementById('detail-container');
    detailContainer.style.display = (detailContainer.style.display === 'none') ? 'flex' : 'none';

    if (detailContainer.style.display === 'flex') {
        showDetail(qr)
    }
}

function historyname(barcodeToSearch) {
    const xmlUrl = 'https://raw.githubusercontent.com/mushketto/mushketto/main/products.xml';

    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var xmlData = xhr.responseText;
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(xmlData, 'text/xml');
                    var items = xmlDoc.getElementsByTagName('item');

                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var barcodeElement = item.getElementsByTagName('barcode')[0];
                        if (barcodeElement) {
                            var barcodeValue = barcodeElement.textContent.trim();
                            if (barcodeValue === barcodeToSearch) {
                                var nameElement = item.getElementsByTagName('name')[0];
                                if (nameElement) {
                                    var nameValue = nameElement.textContent.trim();
                                    resolve(nameValue);
                                    return;
                                }
                            }
                        }
                    }
                    console.log(`Штрихкод ${barcodeToSearch} не найден в XML`);
                    resolve(null);
                } else {
                    reject('Ошибка загрузки XML файла: ' + xhr.status);
                }
            }
        };
        xhr.open('GET', xmlUrl, true);
        xhr.send();
    });
}


function scanqrcheck(barcodeToSearch) {
    const xmlUrl = 'https://raw.githubusercontent.com/mushketto/mushketto/main/products.xml';

    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var xmlData = xhr.responseText;
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(xmlData, 'text/xml');
                    var items = xmlDoc.getElementsByTagName('item');

                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var barcodeElement = item.getElementsByTagName('barcode')[0];
                        if (barcodeElement) {
                            var barcodeValue = barcodeElement.textContent.trim();
                            if (barcodeValue === barcodeToSearch) {
                                resolve(true); // Штрих-код найден, разрешаем Promise с true
                                return;
                            }
                        }
                    }
                    console.log(`Штрихкод ${barcodeToSearch} не найден в XML`);
                    resolve(null);
                } else {
                    reject('Ошибка загрузки XML файла: ' + xhr.status);
                }
            }
        };
        xhr.open('GET', xmlUrl, true);
        xhr.send();
    });
}

// Функция для отображения истории
function showHistory() {
    const historyContainer = document.getElementById('history-items');
    historyContainer.innerHTML = '';

    const user = userid = "'" + userId + "'";
    db.collection('users').doc(user).collection('qrHistory').orderBy('timestamp', 'desc').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyname(doc.data().text.data).then((name) => {
                    historyItem.textContent = `${name} - ${new Date(doc.data().timestamp.toDate()).toLocaleString()}`;
                    historyItem.onclick = () => showDetail(doc.data().text.data);
                });
                historyContainer.appendChild(historyItem);
            });
        })
        .catch((error) => {
            console.error('Ошибка при получении истории QR: ', error);
        });
}

function showProductDetails(details) {
    const detailContainer = document.getElementById('detail-container');
    const detailContent = document.getElementById('detail-content');

    // Установка display в flex для показа контейнера
    detailContainer.style.display = 'flex';

    // Очистка содержимого перед загрузкой новых данных
    detailContent.innerHTML = '';

    // Проверка наличия данных о продукте
    if (details) {
        detailContent.innerHTML = `<h2>${details.name}</h2>`;
        if (details.vendor) {
            detailContent.innerHTML += `<p>Виготовник: ${details.vendor}</p>`;
        }
        if (details.description) {
            detailContent.innerHTML += `<p>Опис: ${details.description}</p>`;
        }
        if (details.price) {
            detailContent.innerHTML += `<p>Ціна: ${details.price} UAH</p>`;
        }
        if (details.guarantee) {
            detailContent.innerHTML += `<p>Гарантія: ${details.guarantee}</p>`;
        }
        if (details.stock) {
            detailContent.innerHTML += `<p>Наявність: ${details.stock}</p>`;
        }
    } else {
        detailContent.innerHTML = '<p>Информация о продукте не найдена</p>';
    }
}


function showDetail(barcode) {
    fetchProductDetails(barcode).then((details) => {
        showProductDetails(details);
    }).catch((error) => {
        console.error('Ошибка при получении подробной информации о товаре: ', error);
        const detailContent = document.getElementById('detail-content');
        detailContent.innerHTML = '<p>Ошибка при загрузке информации о продукте</p>';
    });
}


function closeDetail() {
    const detailContainer = document.getElementById('detail-container');
    detailContainer.style.display = 'none';
}

function fetchProductDetails(barcode) {
    const xmlUrl = 'https://raw.githubusercontent.com/mushketto/mushketto/main/products.xml';

    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var xmlData = xhr.responseText;
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(xmlData, 'text/xml');

                    var items = xmlDoc.getElementsByTagName('item');

                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var barcodeElement = item.getElementsByTagName('barcode')[0];
                        if (barcodeElement) {
                            var barcodeValue = barcodeElement.textContent.trim();
                            if (barcodeValue === barcode) {
                                var name = item.getElementsByTagName('vendor')[0]?.textContent.trim() || null;
                                var vendor = item.getElementsByTagName('vendor')[0]?.textContent.trim() || null;
                                var description = item.getElementsByTagName('description')[0]?.textContent.trim() || null;
                                var price = item.getElementsByTagName('priceRUAH')[0]?.textContent.trim() || null;

                                var guaranteeElement = item.getElementsByTagName('guarantee')[0];
                                var guaranteeValue = guaranteeElement ? guaranteeElement.textContent.trim() : null;
                                if (guaranteeValue != null){
                                    var guaranteeUnit = guaranteeElement.getAttribute('unit') || '';
                                    var guarantee = guaranteeValue !== null ? `${guaranteeValue} ${guaranteeUnit}` : null;
                                };

                                var stock = item.getElementsByTagName('stock')[0]?.textContent.trim() || null;

                                var productDetails = {
                                    name: name,
                                    vendor: vendor,
                                    description: description,
                                    price: price,
                                    guarantee: guarantee,
                                    stock: stock
                                };

                                // Remove null properties from productDetails
                                Object.keys(productDetails).forEach(key => {
                                    if (productDetails[key] === null) {
                                        delete productDetails[key];
                                    }
                                });

                                resolve(productDetails);
                                return;
                            }
                        }
                    }
                    console.log(`Штрихкод ${barcode} не найден в XML`);
                    resolve(null);
                } else {
                    reject('Ошибка загрузки XML файла: ' + xhr.status);
                }
            }
        };
        xhr.open('GET', xmlUrl, true);
        xhr.send();
    });

    detailContainer.style.display = 'flex';
}

// Функция для открытия QR-сканера и сохранения результата
let qrTextReceivedHandler;

function openQRScanner() {
    Telegram.WebApp.showScanQrPopup({
        text: 'Scan QR Code',
        onResult: (result) => {
            return true;
        }
    });

    const handleQrTextReceived = (result) => {
        if (result) {
            Telegram.WebApp.closeScanQrPopup();
            console.log("QR получен");
            const scannedQR = result.data;
            console.log(scanqrcheck(result.data));
            scanqrcheck(result.data)
                .then((isBarcodeFound) => {
                    if (isBarcodeFound === true) {
                        console.log('Штрих-код найден');
                        saveQrResult(result);
                        toggleDetails(scannedQR);
                    } else {
                        console.log('Штрих-код не найден');
                        showNotification("Товар не знайденний у базі");
                    }
                });
            Telegram.WebApp.offEvent('qrTextReceived', handleQrTextReceived); // Удаляем обработчик события после получения QR кода
        }
    };

    if (qrTextReceivedHandler) {
        Telegram.WebApp.offEvent('qrTextReceived', qrTextReceivedHandler);
    }

    qrTextReceivedHandler = handleQrTextReceived;
    Telegram.WebApp.onEvent('qrTextReceived', qrTextReceivedHandler);
}

function webappready(){
    Telegram.WebApp.ready;
    console.log("Telegram WebApp ready, userId:", userId);
};
webappready();