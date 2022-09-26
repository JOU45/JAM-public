function client_lang() {
    return 'ru';
  }
  
  function close_all_taxs_childs_switcher() {
    var result = 0;
    $('li.root_li > .taxs_childs_switcher:checked').each(function (i) {
      result = result + 1;
      var $chk2 = $(this);
      if ($chk2.prop('checked')) $chk2.prop('checked', false);
    });
  
    set_hash_for_opened_root_tax();
    console.log('close_all_taxs_childs_switcher result=', result);
    return result;
  }
  
  function set_hash_for_opened_root_tax() {
    var checked_arr = [];
    $('li.root_li').each(function (i) {
      var $t = $(this);
      var $chk = $t.children('.taxs_childs_switcher');
      if ($chk.prop('checked')) {
        checked_arr.push(parseInt($t.attr('root_id')));
      }
    });
    var new_hash_val = window.location.href.replace(/\#.*$/, '');
    var cur_hash_val = window.location.href;
    if (checked_arr.length == 0) {
      // new_hash_val =;
    }
    if (checked_arr.length == 1) {
      new_hash_val = new_hash_val + '#tr' + parseInt(checked_arr[0]);
    }
    console.log('set_hash_for_opened_root_tax cur_hash_val=', cur_hash_val, ' new_hash_val=', new_hash_val);
    if (cur_hash_val != new_hash_val) {
      if(history.pushState) {
          history.pushState(null, null, new_hash_val);
      }else {
          location.hash = new_hash_val;
      }
      open_root_tax_li_by_hash_val();
    }
  }
  
  function open_root_tax_li_by_hash_val() {
    var cur_hash = window.location.hash.replace(/^\#tr/, '');
    console.log('open_root_tax_li_by_hash_val cur_hash=', cur_hash);
    if (cur_hash > 0) {
      var $d = $('li.root_li[root_id="' + cur_hash + '"]');
      $d.children('.taxs_childs_switcher').prop('checked', true);
      var root_id = parseInt($d.attr('root_id'));
      if (!($d.attr('norm_loaded') == "1")) {
        var included_arr = $d.attr('included_arr');
        var can_include  = $d.attr('can_include');
        var cur_query_params = getArrayFromUrl(window.location.search);
        var checked_ranges = '';
        if (cur_query_params['r' + root_id]) {
          checked_ranges = cur_query_params['r' + root_id].val;
        }
        var url = "/gen_taxons_html?lang=" + client_lang() + "&root_id=" + root_id + "&checked_ranges=" + checked_ranges + "&included_arr=" + included_arr + "&can_include=" + can_include;
        $.ajax(url).done(function(data) {
          // console.log('show_root_taxons success data=', data);
          var json_obj = JSON.parse(data);
          $d.children('.root_tree_main_block').html(json_obj['html']);
          $d.attr('norm_loaded', 1);
        }).fail(function(data){
          console.error('show_root_taxons fail load data=', data);
          $d.children('.root_tree_main_block').html("<span class='xhr_err_html'>ERROR. status [" + data.status + ", " + data.statusText + "]</span>");
        });
      }
    } else {
      close_all_taxs_childs_switcher();
    }
  }
  
  window.onhashchange=function() {
    open_root_tax_li_by_hash_val();
    // var events_cnt = close_all_taxs_childs_switcher();
    // var cur_hash = window.location.hash.replace(/^\#tr/, '');
    // console.log('onhashchange cur_hash=', cur_hash);
    // if (!(cur_hash > 0)) {
    //   close_all_taxs_childs_switcher();
    // }
  //   console.log('onhashchange events_cnt=', events_cnt, ' START_HASH_VAL=', START_HASH_VAL);
  //   if (events_cnt > 0) {
  //     window.location.hash = "no-back-button";
  //     window.location.hash = "Again-No-back-button";
  //     return false;
  //   } else {
  //     console.log('onhashchange no events_cnt! START_HASH_VAL=', START_HASH_VAL);
  //     window.location.hash = START_HASH_VAL;
  //     window.location.hash = START_HASH_VAL + "";
  //     return true;
  //   }
  };
  // window.location.hash = "no-back-button";
  // window.location.hash = "no-back-button2";
  // set_location_hash("no-back-button");
  
  function backspace_pressed(e) {
    var events_cnt = close_all_taxs_childs_switcher();
    // console.log('backspace_pressed events_cnt=', events_cnt);
    if (events_cnt > 0) {
      // console.log('backspace_pressed need stop');
      e.stopPropagation();
      if ($.browser && $.browser.msie) window.event.keyCode = 0;
    } else {
      // set_location_hash(START_HASH_VAL);
    }
    return events_cnt;
  }
  
  $(document).keydown(function(e) { if (e.keyCode == 8) backspace_pressed(e); });
  
  $(document).ready(function(){
    // console.log('started on ready!');
    open_root_tax_li_by_hash_val();
    $('html').on('keydown.bs.dropdown.data-api', function (e) {
      // console.log('dropdown keydown e_which=', e.which);
      if (e.which == 27) close_all_taxs_childs_switcher();
      if (e.which == 8 ) backspace_pressed(e);
    });
    $('body').on('click', function (e) {
      nav_active_switcher_clicked();
      if ($('body').attr('disable_body_click') > 0) return;
      $('li.root_li').each(function (i) {
        if ((!$(this).is(e.target)) && ($(this).has(e.target).length === 0)) {
          var $chk2 = $(this).children('.taxs_childs_switcher');
          if ($chk2.prop('checked')) $chk2.prop('checked', false);
        }
      });
      console.log('body_click_done here 1!');
      set_hash_for_opened_root_tax();
      console.log('body_click_done here 2!');
    });
  });
  
  function nav_active_switcher_clicked(elem) {
    $('.nav_active_switcher.nav_active').removeClass('nav_active');
    if (elem) {
      $(elem).toggleClass('nav_active');
      event.stopPropagation();
      // event.preventDefault();
    }
    return false;
  }
  
  function nav_active_switcher_close(elem) {
    $(elem).closest('.nav_active_switcher').removeClass('nav_active');
    event.stopPropagation();
    return false;
  }
  
  function show_root_taxons(elem, e) {
    // if ($(elem).prop('checked')) {
    //   // $('<div class="modal-backdrop"></div>').appendTo(document.body);
    //   // console.log('checked show_root_taxons');
    //   e.stopPropagation();
    //   e.preventDefault();
    //   var $d = $(elem).closest('li.root_li');
    //   var root_id = parseInt($d.attr('root_id'));
    //   set_hash_for_opened_root_tax();
    //   if (!($d.attr('norm_loaded') == "1")) {
    //     var included_arr = $d.attr('included_arr');
    //     var can_include  = $d.attr('can_include');
  
    //     var cur_query_params = getArrayFromUrl(window.location.search);
    //     var checked_ranges = '';
    //     if (cur_query_params['r' + root_id]) {
    //       checked_ranges = cur_query_params['r' + root_id].val;
    //     }
    //     var url = "/gen_taxons_html?lang=" + client_lang() + "&root_id=" + root_id + "&checked_ranges=" + checked_ranges + "&included_arr=" + included_arr + "&can_include=" + can_include;
    //     $.ajax(url).done(function(data) {
    //       // console.log('show_root_taxons success data=', data);
    //       var json_obj = JSON.parse(data);
    //       $d.children('.root_tree_main_block').html(json_obj['html']);
    //       $d.attr('norm_loaded', 1);
    //     }).fail(function(data){
    //       console.error('show_root_taxons fail load data=', data);
    //       $d.children('.root_tree_main_block').html("<span class='xhr_err_html'>ERROR. status [" + data.status + ", " + data.statusText + "]</span>");
    //     });
    //   }
    // }
  }
  
  function taxs_childs_switcher_changed(elem, e) {
    var $li = $(elem).closest('li');
    if (!(parseInt($li.attr('childs_cnt')) > 0)) {
      chk_status_changed($li.children('label').children('.incl_chk3')[0], e);
    }
  }
  
  function chk_status_changed(elem, e) {
    e.stopPropagation();
    e.preventDefault();
    var cur_val = parseInt($(elem).attr('chk_status')) + 1;
    if (cur_val > 2) { cur_val = 0; }
    var $d = $(elem).closest('li.tax_li3');
    var childs_cnt = parseInt($d.attr('childs_cnt'));
    if (childs_cnt > 0) {
      var childs_checked = parseInt($d.attr('childs_checked'));
      if ((cur_val == 1) && (!(childs_checked > 0))) { cur_val = 2; }
      $d.find('.incl_chk3').each(function (i) {
        var $child = $(this);
        // console.log('chk_status_changed i=', i, ' child=', $child);
        if (cur_val == 1) {
          var old_val = parseInt($child.attr('print_chk_status'));
          $child.attr('chk_status', old_val);
        } else {
          $child.attr('chk_status', cur_val);
        }
      });
    } else {
      if (cur_val == 1) { cur_val = 2; }
      $(elem).attr('print_chk_status', cur_val);
    }
    $(elem).attr('chk_status', cur_val);
    var $root_item = $d.closest('li.root_li');
    var redraw_result = recursive_redraw_tree(20, $d.closest('ul.root_tree_ul')[0]);
    console.log('chk_status_changed redraw_result=', redraw_result);
    show_apply_btn_if_have_changes(elem, redraw_result);
  }
  
  function show_apply_btn_if_have_changes(elem, redraw_result) {
    var $d = $(elem).closest('li.root_li');
    if (redraw_result.childs_have_changes == true) {
      $d.find('.submit_items_block').attr('need_apply', '1');
    } else {
      console.log('done. have not changes.');
      $d.find('.submit_items_block').attr('need_apply', '0');
    }
  }
  
  function reset_all(elem, e) {
    e.stopPropagation();
    e.preventDefault();
    var ul_elem = $(elem).closest('.root_tree_main_block').children('.root_tree_ul')[0];
    recursive_check_all(20, ul_elem, 1);
    var redraw_result = recursive_redraw_tree(20, ul_elem);
    show_apply_btn_if_have_changes(elem, redraw_result);
  }
  
  function check_all(elem, e) {
    e.stopPropagation();
    e.preventDefault();
    var ul_elem = $(elem).closest('.root_tree_main_block').children('.root_tree_ul')[0];
    var chk_result = recursive_check_all(20, ul_elem, 2);
    if (!(chk_result > 0)) recursive_check_all(20, ul_elem, 0);
    var redraw_result = recursive_redraw_tree(20, ul_elem);
    show_apply_btn_if_have_changes(elem, redraw_result);
  }
  
  function recursive_check_all(max_deep, elem, val) {
    var result = 0;
    if (!(max_deep > 0)) return result;
    $(elem).children('li').each(function (i) {
      var $li = $(this);
      var childs_ul = $li.children('ul.taxs_childs')[0];
      if (childs_ul) {
        result = result + recursive_check_all(max_deep - 1, childs_ul, val);
      } else {
        var $chk = $li.children('label').children('.incl_chk3');
        var chk_status = parseInt($chk.attr('chk_status'));
        if (val == 1) {
          var start_chk_status = parseInt($chk.attr('start_chk_status'));
          if (!(chk_status == start_chk_status)) {
            result = result + 1;
            $chk.attr('chk_status', start_chk_status);
          }
        } else {
          if (!(chk_status == val)) {
            result = result + 1;
            $chk.attr('chk_status', val);
          }
        }
      }
    });
    return result;
  }
  
  function recursive_redraw_tree(max_deep, elem) {
    var result = { childs_checked_new: 0, childs_checked: 0, childs_cnt: 0, childs_have_changes: false };
    if (!(max_deep > 0)) return result;
    var need_apply = false;
    // console.log('recursive_redraw_tree max_deep=', max_deep, ' elem=', elem);
    $(elem).children('li').each(function (i) {
      result.childs_cnt = result.childs_cnt + 1;
      var $li = $(this);
      var $chk = $li.children('label').children('.incl_chk3');
      var left_id = parseInt($li.attr('left_id'));
      var left_id = parseInt($li.attr('left_id'));
      var chk_status = parseInt($chk.attr('chk_status'));
  
      var childs_ul = $li.children('ul.taxs_childs')[0];
      if (childs_ul) {
        var childs_result = recursive_redraw_tree(max_deep - 1, childs_ul);
        if (childs_result.childs_checked >= childs_result.childs_cnt) {
          result.childs_checked = result.childs_checked + 1;
          if (!(chk_status == 2)) $chk.attr('chk_status', 2);
        } else {
          if (childs_result.childs_checked > 0) {
            if (!(chk_status == 1)) $chk.attr('chk_status', 1);
          } else {
            if (!(chk_status == 0)) $chk.attr('chk_status', 0);
          }
        }
        if (childs_result.childs_have_changes) { result.childs_have_changes = true; }
        // result.childs_have_changes = true;
        result.childs_checked_new = result.childs_checked_new + childs_result.childs_checked_new;
        // if (!(parseInt($chk.attr('print_chk_status')) ==  childs_result.childs_checked_new)) $chk.attr('print_chk_status', childs_result.childs_checked_new);
        if (!(parseInt( $li.attr('childs_checked'  )) ==  childs_result.childs_checked_new)) $li.attr('childs_checked', childs_result.childs_checked_new);
      } else {
        var start_chk_status = parseInt($chk.attr('start_chk_status'));
        if (!(start_chk_status == chk_status)) { result.childs_have_changes = true; }
        if (parseInt($chk.attr('print_chk_status')) == 2) { result.childs_checked_new = result.childs_checked_new + 1; }
        if (parseInt($chk.attr('chk_status'      )) == 2) { result.childs_checked     = result.childs_checked     + 1; }
      }
      // console.log('recursive_redraw_tree max_deep=', max_deep, ' i=', i, ' li=', $li, ' childs_ul=', childs_ul, " left_id=", left_id);
    });
    // console.log('recursive_redraw_tree max_deep=', max_deep, ' result=', result);
    return result;
  }
  
  function submit_filters(elem, e) {
    var cur_query_params = getArrayFromUrl(window.location.search);
    console.log('submit_filters cur_query_params=', cur_query_params);
    var $d = $(elem).closest('li.root_li');
    var root_id = parseInt($d.attr('root_id'));
    // var checked_left_ids = [];
    let checked_ids_arr = [];
    $d.find('li.tax_li3').each(function (i) {
      var $li = $(this);
      var $chk = $li.children('label').children('.incl_chk3');
      if (parseInt($chk.attr('chk_status')) == 2) {
        // checked_left_ids.push(parseInt($li.attr('left_id')));
        checked_ids_arr.push(parseInt($li.attr('tax_id')));
      }
    });
    // var compacted_ids = array_to_ranges(checked_left_ids);
    let compacted_ids = array_to_ranges(checked_ids_arr);
    console.log('submit_filters root_id=', root_id, ' checked_ids_arr=', checked_ids_arr, ' compacted_ids=', compacted_ids);
    var field_name = 'r' + root_id;
    if (!(cur_query_params[field_name])) cur_query_params[field_name] = { num: (1000 + root_id), val: "" }
    cur_query_params[field_name].val = compacted_ids.join(',');
    if (cur_query_params.page) cur_query_params.page.val = '1';
    var url = getParamsToPathname(cur_query_params);
    console.log('cur_query_params=', cur_query_params, ' url=', url);
    window.location.href = url;
  }
  
  function getParamsToPathname(params){
    var pathname = window.location.pathname+'?';
    var keys = [];
    for (var k in params){
      if (params.hasOwnProperty(k)) {
        keys.push(k);
      }
    }
    keys = keys.sort(function(a, b) { return params[a].num > params[b].num;});
    console.log('getParamsToPathname keys=', keys);
    for (var i = 0; i < keys.length; i++){
      if (params[keys[i]].val.length > 0) pathname += keys[i]+'='+params[keys[i]].val+'&';
    }
    return pathname;
  }
  
  function array_to_ranges(arr) {
    var result = [];
    var start_id = 0;
    var finish_id = 0;
    arr.sort(function (a, b) { return (a - b); }).forEach(function(el) {
      var new_range_started = true;
      if ((start_id > 0) && ((el - 1) == finish_id)) {
        new_range_started = false;
        finish_id = el;
      }
      if (new_range_started) {
        if (start_id > 0) result.push((finish_id == start_id) ? start_id : start_id + "-" + finish_id);
        start_id = el;
        finish_id = el;
      }
      // console.log('array_to_ranges el=', el);
    });
    if (start_id > 0) result.push((finish_id == start_id) ? start_id : start_id + "-" + finish_id);
    return result;
  }
  
  function getArrayFromUrl(url){
    var result = {};
    var num = 0;
    var str = url.replace(/^([^\?]+\??)/, '');
    str.replace( new RegExp( "([^?=&]+)(=([^&]*))?", "g" ), function( $0, $1, $2, $3 ){
      num++;
      result[ $1 ] = { val : $3, num : num };
    });
    return result;
  };
  
  function show_hide_password(elem) {
    event.preventDefault();
    var $show_hide_block = $(elem).closest(".show_hide_password");
    var $inp = $show_hide_block.find('input');
    var $chk = $show_hide_block.find('i');
    if ($chk.hasClass("glyphicon-eye-open")) {
        $inp.attr('type', 'password');
        $chk.addClass( "glyphicon-eye-close" );
        $chk.removeClass( "glyphicon-eye-open" );
    } else {
        $inp.attr('type', 'text');
        $chk.removeClass( "glyphicon-eye-close" );
        $chk.addClass( "glyphicon-eye-open" );
    }
  }
  
  
  