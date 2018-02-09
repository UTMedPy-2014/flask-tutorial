$(document).ready(function () {
    //    var dzi_data = {{ dzi_data|default('{}')|safe }};
    /*    var viewer = new OpenSeadragon({
            id: "view",
            prefixUrl: "static/images/",
            timeout: 120000,
            animationTime: 0.5,
            blendTime: 0.1,
            constrainDuringPan: true,
            maxZoomPixelRatio: 2,
            minZoomLevel: 1,
            visibilityRatio: 1,
            zoomPerScroll: 2,
        });
    */
    $('.wsilist').on('click', function () {
        var jsonData = new Object();
        jsonData.path = "annon/static/storage/wsi_folder/" + $(this).text();
        $.ajax({
            url: '/load_slide',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
        })
            ;
    });

    $('.wsilist').on('click', function () {
        var filename = $(this).text()
        $('#filename').html(filename);
        cropped_text = undefined;
        $('#cropped_offset').html("");
    });


    //tilertab
    $('.wsilist').on('click', function () {
        var jsonData = new Object();
        jsonData.path = "annon/static/storage/wsi_folder/" + $(this).text();
        $.ajax({
            url: '/make_wsi_thumb',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
        });
        String.prototype.rsplit = function(sep, maxsplit) {
          var split = this.split(sep);
          return maxsplit ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit)) : split;
        }
        $(function() {
          $('#wsi_thumb_href').attr("href", jsonData.path.rsplit(".", 1)[0].rsplit("annon", 1)[1]+'_thumb.png');
          $('#wsi_thumb').attr("src", jsonData.path.rsplit(".", 1)[0].rsplit("annon", 1)[1]+'_thumb.png');
          $('#wsi_name').text(jsonData.path);
        });
    });

    //croped_imgcheck
    $(function() {
        $('img#cropped_list').on('click', function() {
            var $imageList = $('.image_list');
            if ($(this).is('.checked')) {
                $(this).removeClass('checked');
            } else {
                $(this).addClass('checked');
            }
        });

        
        $('.image_box .disabled_checkbox').on('click', function() {
            return false;
        });
        
    });

    /*
        viewer.addHandler("open", function() {
            // To improve load times, ignore the lowest-resolution Deep Zoom
            // levels.  This is a hack: we can't configure the minLevel via
            // OpenSeadragon configuration options when the viewer is created
            // from DZI XML.
            viewer.source.minLevel = 8;
        });
    */
    /* スケールバーを非表示
    viewer.scalebar({
        xOffset: 10,
        yOffset: 10,
        barThickness: 3,
        color: '#555555',
        fontColor: '#333333',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    });
    */
});

var annotations = null;

/*open_slide関数をクリックで実行するようにする。*/
$('#show').on('click', function () {
    var viewer = null
    if (!viewer) {
        $("#view").text("");
        var viewer = new OpenSeadragon({
            id: "view",
            prefixUrl: "static/images/",
            timeout: 120000,
            animationTime: 0.5,
            blendTime: 0.1,
            constrainDuringPan: true,
            maxZoomPixelRatio: 2,
            minZoomLevel: 1,
            visibilityRatio: 1,
            zoomPerScroll: 2,
        });

        annotations = new OpenSeadragon.Annotations({ viewer });

        selection = viewer.selection({
            onSelection: function (rect) {
                rect = String(rect)
                rect = rect.slice(1);
                rect = rect.slice(0, -1);
                cutter = (/,|@|x/g)
                rect = rect.split(cutter);
                /*rectに、"["、offset-X座標、offset-Y座標、サイズ縦、サイズ横、レベル、"]"の順に示した文字列が入っている*/
                /*alert(rect + ' Center point: ' + rect.getCenter() + ' Degree rotation: ' + rect.getDegreeRotation());*/
                /*deepzoom_server.pyに配列rectを送る*/
                data = {
                    offsetx: rect[0],
                    offsety: rect[1],
                    sizever: rect[2],
                    sizehor: rect[3],
                    level: rect[4],
                };
                if (typeof cropped_text != "undefined") {
                    cropped_text = cropped_text + "<br>( " + rect[0] + " , " + rect[1] + " )";
                } else {
                    cropped_text = "( " + rect[0] + " , " + rect[1] + " )";
                };
                $('#cropped_offset').html(cropped_text);
                $.ajax({
                    url: '/crop',
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                })
                    ;
                /*ここでデータベースにも保存する*/
            }
        });
    };

    function open_slide(url, mpp) {
        tile_source = "/slide.dzi"
        viewer.open(tile_source);
    }

    open_slide("{{ slide_url }}", parseFloat('{{ slide_mpp }}'));

    // load annotations
    function load_annotations() {
        var paths = new Array();
        $.getJSON("{{ url_for('get_annotations') }}").done(function (data) {
            if (data.paths) {
                for (path of data.paths) {
                    var element = new Array();
                    element.push("path");
                    element.push({
                        "d": path,
                        "fill": "none",
                        "stroke": "red",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": 3,
                        "vector-effect": "non-scaling-stroke"
                    });
                    annotations.model.annotations.push(element); // add data to buffer
                    annotations.dispatch('ACTIVITY_UPDATE'); // refreshing
                }
            }
        });
    }

    viewer.addHandler('open', load_annotations);

});

/*convert実行部分:dataを送るようにしてあるが、既定値だけで動かす予定なので、今のところ意味がない*/
$('#tiling').on('click', function () {
    data = {
        /*ここでデータベースを読みに行って、各データを拾う
        現状、ビューで取るかサーバーで取るか検討中*/
        image_path: "path",
        basename: "hoge",
        tile_size: 256,
        overlap: 32
    }
    $.ajax({
        url: '/tiling',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
    });
    /*ここでデータベースに保存*/
});

$('#save_annotation').on('click', function () {
    var paths = document.getElementsByTagName("path");
    var jsonData = new Object();
    jsonData.paths = new Array();
    for (let path of paths) {
        jsonData.paths.push(path.getAttribute("d"))
    }
    $.ajax({
        url: "{{ url_for('save_annotations') }}",
        type: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(jsonData),
        success: function () {
            alert('success');
        },
        error: function () {
        }
    });
});

$('#refresh_all').on('click', function () {
    annotations.cleanAnnotations();
});

$('#undo').on('click', function () {
    annotations.model.annotations.pop()
    annotations.dispatch('ACTIVITY_UPDATE'); // refreshing
});

