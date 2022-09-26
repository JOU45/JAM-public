function accordeon_head_clicked(elem) { $(elem).closest('.accordeon_list_item_main_block').toggleClass('active'); return false; }


// const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)); }
const sleep = function(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)); }

function refresh_messages_in_list (btn) {
  $(btn).attr('already_runned', '1');
  let $frm = $(btn).closest('form');
  let url = new URL($frm.attr('action') + '?dialog_wnd_id=1', document.location.protocol +'//' + document.location.host);
  let headers2 = { "AuthToken": getCookie('authorization_hash', true) };
  // let password = '';
  if (url.username.length > 0) {
    headers2['Authorization'] = "Basic " + btoa(url.username + ":" + url.password);
    url.username = '';
    url.password = '';
  }

  $.ajax({ url: url.href, headers: headers2 }).done(function(data) {
    let json_obj = JSON.parse(data);
    console.log('refresh_messages_in_list success json_obj=', json_obj);
    $frm.find('.messages_list_table').html($(json_obj.main_text).find('.messages_list_table').html());
    $(btn).attr('already_runned', '0');
  }).fail(function(data){
    console.error('refresh_messages_in_list fail load data=', data);
    $(btn).attr('already_runned', '0');
  });
}

function syncPosition(el) {
  // let $d = $(el).closest('.synchronized_2_sliders');
  let $d = $(el.currentTarget).closest('.synchronized_2_sliders');
  let sync_slider_id = parseInt($d.attr('sync_slider_id'));
  let $lg_slider = $d.children('.sync_large_slider');
  let $sm_slider = $d.children('.sync_small_slider');

  console.log('syncPosition el=', el , ' d=', $d);
  console.log('syncPosition sm_slider=', $sm_slider , ' lg_slider=', $lg_slider);
  if (!(sync_slider_id == 1)) {
    // this line of loop will be turned off.
    var current = el.item.index;

    // var count = el.item.count - 1;
    // var current = Math.round(el.item.index - (el.item.count / 2) - .5);
    // if (current < 0) { current = count; }
    // if (current > count) { current = 0; }

    // console.log('syncPosition count=', count, ' current2=', current);

    console.log('started syncPosition current=', current);

    if (!(sync_slider_id > 0)) {
      $d.attr('sync_slider_id', 1);
      var onscreen = $sm_slider.find('.owl-item.active').length - 1;
      var start = $sm_slider.find('.owl-item.active').first().index();
      var end = $sm_slider.find('.owl-item.active').last().index();
      console.log('syncPosition onscreen=', onscreen, ' start=', start, ' end', end);
      if (current > end  ) { $sm_slider.data('owl.carousel').to(current, 100, true); }
      if (current < start) { $sm_slider.data('owl.carousel').to(current - onscreen, 100, true); }
      console.log('END syncPosition current=', current);
      $d.attr('sync_slider_id', 0);
    }
    $sm_slider.find(".owl-item").removeClass("current").eq(current).addClass("current");
  }
}


function syncPosition2(el) {
  // let $d = $(el).closest('.synchronized_2_sliders');
  let $d = $(el.currentTarget).closest('.synchronized_2_sliders');
  let sync_slider_id = parseInt($d.attr('sync_slider_id'));
  let $lg_slider = $d.children('.sync_large_slider');
  let $sm_slider = $d.children('.sync_small_slider');
  console.log('syncPosition2 el=', el, ' d=', $d);
  if (!(sync_slider_id == 2)) {
    if (!(sync_slider_id > 0)) {
      $d.attr('sync_slider_id', 2);
      var number = el.item.index;
      console.log('started syncPosition2 number=', number);
      $lg_slider.data('owl.carousel').to(number, 100, true);
      console.log('END syncPosition2 number=', number);
      $d.attr('sync_slider_id', 0);
    }
  }
}


$(document).ready(function() {
  var EACH_5_SECONDS_TIMER = setInterval(function() {
    if (!($('body').attr('dev') > 1)) { // Turned off on dev
      $('.modal.show .each_5_seconds_btn[already_runned="0"]').each(function (i) { $(this).click(); });
    }
  } , 5000);





      $('#bottom_card_viewed_slider').owlCarousel({
        dots: false,
        nav: false,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3800,
        autoplaySpeed: 1500,
        margin: 30,
        responsive : {
          0 : {
            items: 3
          },
          768 : {
            items: 4
          },
          992 : {
            items: 6
          }
        }
      });

      $('.main_page_prods_owl_slider_carousel').owlCarousel({
        dots: false,
        nav: false,
        loop: true,
        autoplay: true,
        autoplayTimeout: 3800,
        autoplaySpeed: 1500,
        margin: 30,
        responsive : {
          0 : {
            items: 3
          },
          768 : {
            items: 4
          },
          992 : {
            items: 6
          }
        }
      });
});



// function reinit_date_ranges() {
//   // if ( moment) {
//   if (typeof moment !== 'undefined') {
//     moment.locale('ru');
//     $('input[name="date_range"], input.date_range').each(function(){
//       var initPickerDates =  $(this).val().split(' - ');
//       var ranges = {
//         '+-5 дней':[moment().subtract(5, 'days'), moment().add(5, 'day')],
//         'Сегодня': [moment(), moment()],
//         'Вчера': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//         'Текущую неделю': [moment().add(1, 'days').startOf('week'), moment()],
//         'Последние 7 дней': [moment().subtract(6, 'days'), moment()],
//         'Последние 30 дней': [moment().subtract(29, 'days'), moment()],
//         'Этот месяц': [moment().startOf('month'), moment().endOf('month')],
//         'Предыдущий месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
//         'Этот год': [moment().startOf('year'), moment().endOf('year')],
//         'Предыдущий год' : [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
//         'Последние 5 лет': [moment().subtract(5, 'year').startOf('year'), moment().subtract(0, 'year').endOf('year')]
//       };
//       var skip_ranges = ($(this).attr('skip_ranges')) ? $(this).attr('skip_ranges').split(',') : [];
//       if (!(skip_ranges.indexOf('all_time') >= 0)) ranges['Всё время'] = [moment("1970-01-01", 'YYYY-MM-DD'), moment("2038-01-19", 'YYYY-MM-DD')];
//       $(this).daterangepicker({
//         ranges: ranges,
//         startDate: moment(initPickerDates[0], 'YYYY-MM-DD'),
//         endDate: moment(initPickerDates[1], 'YYYY-MM-DD'),
//         cancelClass: 'hidden',
//         locale: {
//           applyLabel: 'Применить',
//           cancelLabel: 'Отменить',
//           fromLabel: 'С',
//           toLabel: 'По',
//           customRangeLabel: 'Уточнить период',
//           daysOfWeek: moment.weekdaysMin(),
//           format: 'YYYY-MM-DD'
//         }
//       });
//       $('input[name="date_range"]').on('apply.daterangepicker', function(ev, picker) {
//         $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
//         $(this).parents('form:first').submit();
//       });
//       $('input.date_range').on('apply.daterangepicker', function(ev, picker) {
//         $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
//       });
//     });
//   }

// }

function remove_item_by_delete_form_btn(elem) {
  let params = {};
  if (!(confirm('Удалить этот элемент безвозвратно?!'))) return false;
  let $this = $(elem);
  let after_delete_redirect_path = $this.attr('after_delete_redirect_path');
  let on_success_only_close_modal = parseInt($this.attr('on_success_only_close_modal'));
  let form = $this.closest('form')[0];
  let _csrf = $(form).serializeArray().find(function(el) { return el.name == '_csrf'; }).value;
  // console.log('_csrf=', _csrf);
  if (!($this.data('method') == 'delete')) {
    alert('Error 12312564 not found method attr=delete in link tag');
    return false;
  }

  let headers2 = { "AuthToken": params.auth_token || getCookie('authorization_hash', true) };

  $.post({ type: 'delete', url: form.action + '?_csrf=' + _csrf + '&dialog_wnd_id=1', headers: headers2 }, {}, function(res, textStatus) {
    console.log('remove_item_by_delete_form_btn success res=', res);
    if (res.msg) {
      alert(res.msg);
    } else {
      if (res.result > 0) {
        if (on_success_only_close_modal > 0) {
          let $m = $this.closest('.modal');
          if ($m.length > 0) {
            $m.modal('hide');
            refresh_model_items_htmls_in_list(res, '', { ignore_refresh: 1 });
            return false;
          }
        }
        document.location.href = after_delete_redirect_path;
      }
      return false;
    }
  }, "json");

}

function fill_data_from_this_payment_setttings(elem) {
  event.stopImmediatePropagation();
  let vals = JSON.parse($(elem).attr('vals'));
  let p_opts = JSON.parse(vals.payment_options_json);
  console.log('started fill_data_from_this_payment_setttings vals=', vals, ' p_opts=', p_opts);
  let $f = $('form[form_name="client_edit_payment"]');
  $f.find('input[type="radio"][name="payment_type_id"][value="' + vals.payment_type_id + '"]').prop('checked', true);
  $f.find('input[name="save_input_data_to_profile"]').prop('checked', true);
  $f.find('input[name="save_input_data_name"]').val(vals.name);

  for (let k in p_opts) { if (p_opts.hasOwnProperty(k)) { $f.find('input[name="' + k + '"]').val(p_opts[k]); } }
  $('.modal.choose_payment_modal').modal('hide');
  $f.find('.card_number_masked').trigger('blur');
  $f.find('.card_expiry_date_input').trigger('blur');
  return false;
}


function on_off_item_by_ajax(elem, refresh_after_on_off) {
  // console.log("on_off_item_by_ajax started.");
  event.stopImmediatePropagation();
  let item_id = parseInt($(elem).closest('.table_model_row').attr('item_id'));
  let switch_on = $(elem).closest('.table_model_row').find('.on_off_chk').prop('checked') ? 0 : 1;
  if (!(item_id > 0)) { alert('ERROR 555454545. Not found item_id in table_model_row. item_id=', item_id); return false; }

  if (!($(elem).data('method') == 'post')) {
    alert('Error 1231256422 not found method attr=post in link tag');
    return false;
  }
  $.post({ type: 'post', url: $(elem).attr('href') + '&switch_on=' + switch_on }, {}, function(res, textStatus) {
    // console.log('on_off_item_by_ajax success res=', res, ' refresh_after_on_off=', refresh_after_on_off);
    if (res.msg) {
      alert(res.msg);
    } else {
      if (refresh_after_on_off > 0) {
        document.location.href = document.location.href;
        return true;
      }
      let $status_item = $('.table_model_row[model_name="' + res.item_data.model_name + '"][item_id="' + res.item_data.id + '"]');
      let $chk = $status_item.find('.on_off_chk');
      $chk.prop('checked', (res.item_data.val > 0) ? true : false);
      // $chk.prop('checked', false);
    }
  }, "json");
  return false;
}
// $(document).on('click', 'a.jquery-method-delete', function(e) {
function remove_item_by_delete(elem, refresh_on_delete) {
  let params = {};
  // event.preventDefault(); // does not go through with the link.
  event.stopImmediatePropagation();
  // event.preventDefault(); // does not go through with the link.
  if (!(confirm('Remove this item?! Are you sure?'))) return false;
  // let $this = $(elem);

  if (!($(elem).data('method') == 'delete')) {
    alert('Error 12312564 not found method attr=delete in link tag');
    return false;
  }

  let headers2 = { "AuthToken": params.auth_token || getCookie('authorization_hash', true) };
  let url2 = $(elem).attr('href');
  url2 = url2 + ((url2.indexOf('?') > 0) ? '&' : '?') + '_csrf=' + $('body').attr('csrf_val');
  $.post({ type: 'delete', url: url2, headers: headers2 }, { _csrf: $('body').attr('csrf_val') }, function(res, textStatus) {
    console.log('remove_item_by_delete success res=', res, ' refresh_on_delete=', refresh_on_delete);
    if (res.msg) {
      alert(res.msg);
    } else {
      if (refresh_on_delete > 0) {
        document.location.href = document.location.href;
        return true;
      }
      for (let k in res.deleted_items) {
        if (res.deleted_items.hasOwnProperty(k)) {
          res.deleted_items[k].forEach(function(item_id) {
            let $removed_item = $('.table_model_row[model_name="' + k + '"][item_id="' + item_id + '"],.list_item_block[list_item_model="' + k + '"][list_item_id="' + item_id + '"]');
            let ch_selector = 'td';
            let tag_name = $removed_item.prop("tagName");
            if (tag_name == 'LI') { ch_selector = 'label'; }
            $removed_item.children(ch_selector)
              .animate({ padding: 0 })
              .wrapInner('<div />')
              .children()
              .slideUp(function() { $(elem).closest(tag_name).remove(); });
          });
        }
      }
      // document.location.href = document.location.href;
    }
  }, "json");
// });
  return false;
}


// function cart_change_qty(elem) {
//   event.stopPropagation();
//   event.preventDefault();
//   console.log('runned cart_change_qty');
//   var $d = $(elem.closest('.basket_prod_item'));
//   var coupon_id = parseInt($d.attr("coupon_id"));
//   var $m = $('#qty_modal_form');
//   $m.find('.modal_qty_changer').val(parseInt($d.attr('qty')));
//   $m.find('.modal_product_name').text($d.find('.prod_name_text').text());
//   $m.attr('qty_modal_coupon_id', coupon_id);
//   $m.attr('bpid', $d.attr('bpid'));
//   $m.attr('form_name', $d.closest('.prods_data_edit_form').attr('form_name'));
//   $m.modal('show');
//   return false;
// }

function cart_modal_remove_prod_clicked(elem) {
  event.stopPropagation();
  event.preventDefault();
  console.log('runned cart_modal_remove_prod_clicked');
  if (!(confirm('Remove product from cart?'))) return false;
  var $c = $(elem).closest('.cart_prod_edit_form').find('.modal_qty_changer');
  $c.val(0);
  $(elem).closest('form').submit();
  return false;
}

function cart_change_qty_clicked(elem, inc_val) {
  event.stopPropagation();
  event.preventDefault();
  console.log('runned cart_change_qty_clicked inc_val=', inc_val);
  var $c = $(elem).closest('.cart_prod_edit_form').find('.modal_qty_changer');
  var new_val = parseInt($c.val().trim()) + parseInt(inc_val);
  if (!(new_val >= 0     )) return false;
  if   (new_val >  1000000) return false;
  $c.val(new_val);
  return false;
}

// function cart_prod_update_quantity(elem) {
//   event.stopPropagation();
//   event.preventDefault();
//   console.log('runned cart_prod_update_quantity');
//   var $m = $(elem).closest('#qty_modal_form');
//   var url_tmp = $m.attr('list_url') + "/" + parseInt($m.attr('bpid'));
//   var req_params = { new_qty: $m.find('#modal_qty_changer').val(), form_name: $m.attr('form_name'), _csrf: $('body').attr('csrf_val') };
//   $.post({ url: url_tmp }, req_params, function(res, textStatus) {
//     console.log('cart_prod_update_quantity success res=', res);
//     $('.cabinet_cart_block[cart_id="' + res.cart_id + '"][cabinet_id="' + res.cab_id + '"]').html(res.cab_cart_html);
//     $('.prepeare_order_block[cart_id="' + res.cart_id + '"][cabinet_id="' + res.cab_id + '"]').html(res.prepeare_order_block_html);

//     // if (res.msg) {
//     //   alert(res.msg);
//     // } else {

//       // return false;
//     // }
//     $m.modal('hide');
//     return false;
//   }, "json");
//   return false;
// }

function show_delivery_options_modal(elem) {
  event.stopPropagation();
  event.preventDefault();
  var $d = $(elem).closest('.cart_cab_settings_main_block');
  var $m = $('#delivery_modal_form');
  var cab_id = parseInt($d.attr('cabinet_id'));
  var form_name = $d.closest('.prods_data_edit_form').attr('form_name');
  var cpds_id = parseInt($d.attr('cpds_id')) || 0;
  console.log('runned show_delivery_options_modal cab_id=', cab_id, " cpds_id=", cpds_id);
  $m.attr('cab_id', cab_id);
  $m.find('.client_select_from_list_url_link').attr('href', $m.attr('profile_ds_url') + '?cab_id='+cab_id);
  $('#delivery_modal_form_body').html('Loading...');
  $m.modal('show');
  var url_tmp = $m.attr('list_url') + "/delivery_modal/" + cab_id + '?cpds_id=' + cpds_id + '&form_name=' + form_name;
  $.ajax(url_tmp).done(function(data) {
    // console.log('show_delivery_options_modal success data=', data);
    var json_obj = JSON.parse(data);
    $('#delivery_modal_form_body').html(json_obj.delivery_modal_html);
    init_dropdowns_for_filter_in_modal($m[0]);
    // $m.find('.cart_dropdown_with_filter').on('hide.bs.dropdown', function (e) {
    //     var target = $(e.target);
    //     var $inp = target.find('.dropdown_search_input');
    //     if (($inp.is(":focus")) && ((target.hasClass("keepopen") || target.parents(".keepopen").length))) {
    //         // console.log('cart_dropdown_with_filter hide dropdown target=', e.target);
    //         return false; // returning false should stop the dropdown from hiding.
    //     }else{
    //         return true;
    //     }
    // });
    // $m.find('.cart_dropdown_with_filter').on('show.bs.dropdown', function (e) {
    //   var $target = $(e.target);
    //   var $inp = $target.find('input.dropdown_search_input');
    //   e.stopPropagation();
    //   window.setTimeout(function() { $inp[0].focus(); },10);
    //   // console.log('cart_dropdown_with_filter on show dropdown done!');
    // });
  }).fail(function(data){
    console.error('show_delivery_options_modal fail load data=', data);
    $('#delivery_modal_form_body').html("<span class='xhr_err_html'>ERROR. status [" + data.status + ", " + data.statusText + "]</span>");
  });
}

function init_choose_delivery_modal(fparam) {
  console.log('init_choose_delivery_modal fparam=', fparam);
  init_dropdowns_for_filter_in_modal($('#' + fparam.modal_id)[0]);
}

function init_dropdowns_for_filter_in_modal(elem) {
  let $m = $(elem);
  // if (parseInt($m.attr('init_dropdowns_for_filter_done')) > 0) return false;
  $m.find('.cart_dropdown_with_filter').not(".hide_bs_dropdown_done").addClass('hide_bs_dropdown_done').on('hide.bs.dropdown', function (e) {
      var target = $(e.target);
      var $inp = target.find('.dropdown_search_input');
      if (($inp.is(":focus")) && ((target.hasClass("keepopen") || target.parents(".keepopen").length))) {
          // console.log('cart_dropdown_with_filter hide dropdown target=', e.target);
          return false; // returning false should stop the dropdown from hiding.
      }else{
          return true;
      }
  });
  $m.find('.cart_dropdown_with_filter').not(".show_bs_dropdown_done").addClass('show_bs_dropdown_done').on('show.bs.dropdown', function (e) {
    var $target = $(e.target);
    var $inp = $target.find('input.dropdown_search_input');
    e.stopPropagation();
    window.setTimeout(function() { $inp[0].focus(); },10);
    // console.log('cart_dropdown_with_filter on show dropdown done!');
  });
  // $m.attr('init_dropdowns_for_filter_done', 1);
}

function empty_modal_html(modal_id, modal_class, params = {}) {
  return '<div class="modal ' + modal_class + ' empty_modal_html_main fade" id="' + modal_id + '" tabindex="-1" role="dialog" aria-labelledby="change_model_link_id" aria-hidden="true" ><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Loading...</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body form_post_outer_block"/></div></div></div>';
}

function fill_modal_from_url(modal_wnd, url_in, params) {
  if (!(params)) params = {};
  let url = new URL(url_in, document.location.protocol +'//' + document.location.host);
  let modal_id = $(modal_wnd).attr('id');
  url.searchParams.set('dialog_wnd_id', modal_id);
  $(modal_wnd).children('.modal-dialog').children('.modal-content').children('.modal-body').html('');
  $(modal_wnd).children('.modal-dialog').children('.modal-content').children('.modal-header').find('.modal-title').html('&nbsp;');
  if (!(params.request_method))
    params.request_method = 'GET';

  let headers2 = { "AuthToken": params.auth_token || getCookie('authorization_hash', true) };
  // let password = '';
  if (url.username.length > 0) {
    headers2['Authorization'] = "Basic " + btoa(url.username + ":" + url.password);
    // username = url.username + '';
    // password = url.password + '';
    url.username = '';
    url.password = '';
  }

  // if (params.request_method == "POST") {
  //   let options_heads = { 'Access-Control-Request-Method': params.request_method, 'Access-Control-Request-Headers': 'Authorization, Content-Type' };
  //   $.ajax({ url: url.href, type: "OPTIONS", headers: options_heads,
  //     success: function(res) {
  //       console.log('fill_modal_from_url option success res=', res);
  //     },
  //     error: function(res) {
  //       console.error('fill_modal_from_url option fail res=', res);
  //     }
  //   });
  // }

  console.log('fill_modal_from_url headers=', headers2, ' url=', url);
  $.ajax({ url: url.href, type: params.request_method || "GET", dataType: "json", headers: headers2,
    success: function(res) {
      // console.log('fill_modal_from_url success res=', res, 'this=', this);
      // console.log('fill_modal_from_url headers2.AuthToken=', headers2.AuthToken, 'auth_token=', res.auth_token, 'window.location.hostname=', window.location.hostname);
      if ((!((headers2.AuthToken) && (headers2.AuthToken.length > 0))) && (res.auth_token)) {
        setCookie('authorization_hash', res.auth_token, { expires: 20000, path: '/' }, true);
      }
      // if (res.redirect) return window.location.href = res.redirect;
      fill_form_post_outer_block($(modal_wnd).children('.modal-dialog').children('.modal-content').children('.modal-body')[0], res);
      let wnd_title = res.modal_title_html || res.title || 'No title found in response';
      // console.log('fill_modal_from_url params=', params ,' wnd_title=', wnd_title);
      $(modal_wnd).children('.modal-dialog').children('.modal-content').children('.modal-header').find('.modal-title').html(wnd_title);
      let modal_data_str = $(modal_wnd).attr('modal_data');
      if (!(modal_data_str)) modal_data_str = '{}';
      let modal_data = JSON.parse(modal_data_str);

      // console.log('success fill_modal_from_url modal_data=', modal_data);
      if (modal_data.func && (modal_data.func.length > 0)) {
        let fparam = modal_data.fparam || {};
        fparam.modal_id = modal_id;
        window[modal_data.func](fparam);
      }
      init_js_components(modal_wnd);
    },
    error: function(res) {
      console.error('fill_modal_from_url fail res=', res);
      try {
        let data = JSON.parse(res.responseText);
        console.log('fill_modal_from_url err data=', data);
        if (data.main_text) {
          fill_form_post_outer_block($(modal_wnd).children('.modal-dialog').children('.modal-content').children('.modal-body')[0], data);
          let wnd_title = data.title || 'No title found in response';
          $(modal_wnd).children('.modal-dialog').children('.modal-content').children('.modal-header').find('.modal-title').html(wnd_title);
          return false;
        }
      } catch(error) {
        console.error(error);
      }
      $(modal_wnd).children('.modal-dialog').children('.modal-content').children('.modal-body').html(res.responseText);
    }
  });
}

function fill_block_from_url(block, url_in, params) {
  if (!(params)) params = {};
  if (!(url_in)) url_in = $(block).attr('fill_url');
  let url = new URL(url_in, document.location.protocol +'//' + document.location.host);
  url.searchParams.set('dialog_wnd_id', '1');
  $(block).html('Loading...');
  console.log('fill_block_from_url url=', url);
  $.ajax({ url: url.href, type: params.request_method || "GET", dataType: "json",
    success: function(res) {
      // console.log('fill_block_from_url params=', params ,' res=', res);
      let block_data_str = $(block).attr('fill_block_data');
      if (!(block_data_str)) block_data_str = '{}';
      let block_data = JSON.parse(block_data_str);

      // console.log('success fill_block_from_url block_data=', block_data);
      // if (block_data.func && (block_data.func.length > 0)) {
      //   let fparam = block_data.fparam || {};
      //   fparam.block_id = modal_id;
      //   window[block_data.func](fparam);
      // }
      $(block).html(res.main_text);
      init_js_components(block);
    },
    error: function(res) {
      console.error('fill_block_from_url fail res=', res);
      try {
        let data = JSON.parse(res.responseText);
        console.log('fill_block_from_url err data=', data);
        if (data.main_text) {
          $(block).html(data.main_text);
          return false;
        }
      } catch(error) {
        console.error(error);
      }
      $(block).html(res.responseText);
    }
  });
}

function form_edit_link_changed(elem) {
  // console.log('form_edit_link_changed elem=', elem);
  let val = ($(elem).attr("type") == 'checkbox') ? ($(elem).prop('checked') ? $(elem).attr('value') : '0') : $(elem).val();
  // console.log('form_edit_link_changed val=', val);
  let $d = $(elem).closest('.form_edit_link_block');
  let $btn = $d.find('.form_edit_link_target');
  let targ_url = $btn.attr('href');
  let url = new URL(targ_url, document.location.protocol +'//' + document.location.host);
  url.searchParams.set($(elem).attr('name'), val);
  $btn.attr('href', url.href);
  return false;
}

function show_in_modal_link(elem, modal_class, params) {
  if (!(params)) params = {};
  event.stopPropagation();
  event.preventDefault();
  let url = $(elem).attr('href');
  let data = $(elem).data();
  if (!(data)) data = {};
  let modal_id = (params.m) ? params.m : ('modal_auto_id_' + url.replace(/[^a-z0-9]/g, '_'));
  console.log('started show_in_modal_link url=', url, ' modal_id=', modal_id, ' params=', params, ' data=', data);
  if (!($('#' + modal_id).length > 0)) $('body').append($(empty_modal_html(modal_id, modal_class)));
  let $d = $('#' + modal_id);
  // let params = {};
  // let onload_func = $(elem).attr('onload_func');
  // if (onload_func && (onload_func.length > 0)){
  //   params.onload_func = onload_func;
  //   params.onload_func_params = $(elem).attr('onload_func_params');
  // }
  $d.attr('modal_data', JSON.stringify(data));
  $d.modal('show');
  // $d.draggable({ handle: ".modal-header" });
  fill_modal_from_url($d[0], url, data);
  return false;
}

function fill_modal_from_url_if_in_modal(elem) {
  console.log('started fill_modal_from_url_if_in_modal');
  if ($(elem).closest('.modal').length > 0) {
    let $d = $(elem).closest('.modal');
    var new_href = $(elem).attr('href');
    if (!(new_href.indexOf('dialog_wnd_id=') > 0)) {
      new_href = new_href + ((new_href.indexOf('?') >= 0) ? '&' : '?') + "dialog_wnd_id=" + $d.attr('id');
    }
    console.log('fill_modal_from_url_if_in_modal new_href=', new_href);
    fill_modal_from_url($d[0], new_href, {});
    return false;
  }
  // return false;
  return true;
}

function trade_url() { return $('body').attr('trade_url'); }

function client_acc_change_currency(new_currency_id) {
  console.log('started client_acc_change_currency new_currency_id=', new_currency_id);
  $.post({ url: trade_url() + '/ru/set_currency_id' }, { new_currency_id: new_currency_id, _csrf: $('body').attr('csrf_val') }, function(res, textStatus) {
    console.log('client_acc_change_currency success res=', res);
    if (res.msg) {
      alert(res.msg);
    } else {
      if (res.result > 0) {
        setCookie('currency_id', parseInt(new_currency_id), { expires: parseInt(10000), path: '/', DOMAIN: window.location.hostname });
        document.location.reload(true);
      }
      return false;
    }
  }, "json");
}

function getCookie(name, ignore_host_name) {
  if (!(ignore_host_name)) name = window.location.hostname.replace(/(\.[\s\S]*)$/, '') + '_' + name;
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options, ignore_host_name) {
  if (!(ignore_host_name)) {
    name = window.location.hostname.replace(/(\.[\s\S]*)$/, '') + '_' + name;
  }
  options = options || {};
  var expires = options.expires;
  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + (expires * 1000*60*60)); // еденицы измерения - часы (hours).
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
    // alert('expires='+options.expires);
  }

  value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;
  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  console.log('setCookie updatedCookie=', updatedCookie)
  document.cookie = updatedCookie;
}

$(document).ready(function () {
  console.log('ready started here!');
  // check_last_client_acc_id_in_cookie();
  init_dropdowns_for_filter_in_modal($('body')[0]);
  init_js_components($('body')[0]);
});

function init_js_components(elem) {
  let $m = $(elem);
  console.log('init_js_components started');
  let svg_arrow_str = '<svg width="100%" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>';
  // if (parseInt($m.attr('init_dropdowns_for_filter_done')) > 0) return false;
  $m.find('.masked_phone').not(".mask_init_done").addClass('mask_init_done').each(function (e, item) {
    console.log('init_js_components phone e=', e, ' item=', item);
    $(item).mask('+38 (999) 999-99-99');
  });
  $m.find('.card_expiry_date_input').not(".mask_init_done").addClass('mask_init_done').each(function (e, item) {
    console.log('init_js_components card_expiry_date_input e=', e, ' item=', item);
    $(item).mask('99/99');
  });

  $m.find('.card_number_masked').not(".mask_init_done").addClass('mask_init_done').each(function (e, item) {
    console.log('init_js_components card_expiry_date_input e=', e, ' item=', item);
    $(item).mask('9999 9999 9999 9999');
  });
  if (typeof moment !== 'undefined') {
    $('.main_client_datetimepicker').each(function (i) {
      let $pic = $(this);
      if (!(parseInt($pic.attr('dtimepicker_init_done')) > 0)) {
        $pic.attr('dtimepicker_init_done', 1);
        let val = $pic.attr('value');
        let dt_format = 'DD/MM/YYYY HH:mm:ss';
        console.log('try load datetimepicker. val=', val ,' dt_format=', dt_format, ' pic=', $pic);
        $pic.datetimepicker({
          locale: 'ru',
          format: dt_format,
          userCurrent: false,
          date: moment(val, dt_format),
        });
      }
    });
  }

  $m.find('.synchronized_2_sliders').not(".synchronized_2_sliders_init_done").addClass('synchronized_2_sliders_init_done').each(function (e, item) {
    let slidesPerPage = 8; //globaly define number of elements per page
    let $d = $(item);
    $d.attr('sync_slider_id', 0);
    $d.attr('sync_slidesPerPage', slidesPerPage);
    let sync_slider_id = parseInt($d.attr('sync_slider_id'));
    let $lg_slider = $d.children('.sync_large_slider');
    let $sm_slider = $d.children('.sync_small_slider');



    $lg_slider.owlCarousel({
      items: 1,
      slideSpeed: 200,
      nav: true,
      loop: false,
      // loop: true,
      dots: false,
      autoplay: false,

      responsiveRefreshRate: 200,
      // navText: [, '<svg width="100%" height="100%" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>'],
      // navText: ['<img src="/f/pics/slider/arr-violet_left.png"/>', '<img src="/f/pics/slider/arr-violet_left.png" />']
      navText: [svg_arrow_str, svg_arrow_str]
    }).on('changed.owl.carousel', syncPosition);

    $sm_slider.on('initialized.owl.carousel', function() { $(this).closest('.synchronized_2_sliders').children('.sync_small_slider').find(".owl-item").eq(0).addClass("current"); }).owlCarousel({
      items: slidesPerPage,
      nav: true,
      loop: false,
      // loop: true,
      dots: false,
      autoplay: false,
      smartSpeed: 100,
      slideSpeed: 200,
      slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
      responsiveRefreshRate: 100,
      // navText: ['<svg width="100%" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>', '<svg width="100%" height="100%" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>']
      // navText: ['<img src="/f/pics/slider/arr-violet_left.png"/>', '<img src="/f/pics/slider/arr-violet_left.png" />']
      navText: [svg_arrow_str, svg_arrow_str]
    }).on('changed.owl.carousel', syncPosition2);

    $sm_slider.on("click", ".owl-item", function(e) {
      let $t = $(this);
      e.preventDefault();
      let number = $t.index();
      $t.closest('.synchronized_2_sliders').children('.sync_large_slider').data('owl.carousel').to(number, 300, true);
    });
  });

  $m.find('.prod_info_files_list_slider').not(".prod_info_files_list_slider_init_done").addClass('prod_info_files_list_slider_init_done').each(function (e, item) {
    let slidesPerPage2 = 4;
    $(item).find('.owl-carousel').owlCarousel({
      items: slidesPerPage2,
      nav: true,
      loop: false,
      // loop: true,
      dots: false,
      autoplay: false,
      smartSpeed: 100,
      slideSpeed: 200,
      slideBy: slidesPerPage2, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
      responsiveRefreshRate: 100,
      // navText: ['<svg width="100%" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>', '<svg width="100%" height="100%" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>']
      // navText: ['<img src="/f/pics/slider/arr-violet_left.png"/>', '<img src="/f/pics/slider/arr-violet_left.png" />']
      navText: [svg_arrow_str, svg_arrow_str]
    });
  });

  $m.find('.jur_files_list_slider').not(".jur_files_list_slider_init_done").addClass('jur_files_list_slider_init_done').each(function (e, item) {
    let slidesPerPage2 = 4;
    $(item).find('.owl-carousel').owlCarousel({
      items: slidesPerPage2,
      nav: true,
      loop: false,
      // loop: true,
      dots: false,
      autoplay: false,
      smartSpeed: 100,
      slideSpeed: 200,
      slideBy: slidesPerPage2, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
      responsiveRefreshRate: 100,
      // navText: ['<svg width="100%" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>', '<svg width="100%" height="100%" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>']
      // navText: ['<img src="/f/pics/slider/arr-violet_left.png"/>', '<img src="/f/pics/slider/arr-violet_left.png" />']
      navText: [svg_arrow_str, svg_arrow_str]
    });
  });

  $m.find('.select2-multiple').not(".select2_multiple_with_tags").not(".select2_multiple_init_done").addClass('select2_multiple_init_done').each(function (e, item) {
    $(item).select2( {
      theme: "bootstrap",
      maximumSelectionSize: 6,
      containerCssClass: ':all:',
      templateResult: function (data, container) {
        if (data.element) {
          $(container).attr('style', $(data.element).attr("style"));
        }
        return data.text;
      }
    });
  });

  $m.find('.select2-multiple.select2_multiple_with_tags').not(".select2_multiple_with_tags_init_done").addClass('select2_multiple_with_tags_init_done').each(function (e, item) {
    $(item).select2( {
      theme: "bootstrap",
      maximumSelectionSize: 6,
      tags: true,
      containerCssClass: ':all:',
      templateResult: function (data, container) {
        if (data.element) {
          $(container).attr('style', $(data.element).attr("style"));
        }
        return data.text;
      }
    });
  });



  console.log('init_js_components end');
}

function show_search_form(elem) {
  let $srch = $(elem).closest('.search');
  if (!($srch.hasClass("search_input_have_val"))) $srch.addClass('search_input_have_val');
  return false;
}

function hide_search_if_no_val(elem) {
  let $srch = $(elem).closest('.search');
  if ($srch.find('.search-input').val().length == 0) $srch.removeClass('search_input_have_val');
  return false;
}


function init_product_images_galery() {
  $('#print_product_images_carousel').owlCarousel({
    items: 1,
    slideSpeed: 200,
    nav: false,
    loop: false,
    // loop: true,
    dots: true,
    autoplay: false,
  }).on('changed.owl.carousel', set_open_in_new_tab_link);
  console.log('init_product_images_galery done!');
  set_open_in_new_tab_link_by_index(0);
}

function set_open_in_new_tab_link(el) { set_open_in_new_tab_link_by_index(el.item.index); }
function set_open_in_new_tab_link_by_index(slide_index) {
  let img_src = $('#print_product_images_carousel').find(".owl-item").eq(slide_index).find('img').attr('src');
  // console.log('set_open_in_new_tab_link img_src=', img_src);
  $('#product_images_carousel_open_in_new_tab_link').attr('href', img_src);
}


function confirm_link_press (elem) {
  console.log('runned confirm_link_press');
  return false;
}

function fill_form_post_outer_block(elem, res) {
  // console.log('started fill_form_post_outer_block. elem=', elem, ' res=', res);
  if (!(elem)) return false;
  $(elem).html("<div class='modal_flash_html_block'>" + res.flash_html + '</div><div class="main_text_block">' + res.main_text + '</div>');
  return true;
}

function form_to_params(form) {
  var result = {};
  var arr = $(form).serializeArray();
  arr.forEach(function(el) {
    result[el['name']] = ((result[el['name']]) ? result[el['name']] + ',' : '') + el['value'];
  });
  return result;
}


function run_ajax_submit_if_modal(elem, params_in) {
  if (!($(elem).closest('.modal').length > 0)) return true;
  // let fdata = form_to_params(elem);
  let fdata = new FormData(elem); // FormData NOT WORKING IN IE(need check), AND NOT WORKING WITH METHOD=GET!!!!! SO ONLY POST!
  fdata.append('dialog_wnd_id', '1');
  // fdata['dialog_wnd_id'] = 1;

  let $btn = $(document.activeElement);
  // console.log('run_ajax_submit_if_modal btn=', $btn, ' name=', $btn.attr('name'));
  if (($btn.length > 0) && ($btn.attr('name')) && ($btn.prop("tagName").toLowerCase() == 'input')) {
    // fdata[$btn.attr('name')] = $btn.attr('value');
  }

  // console.log('run_ajax_submit_if_modal event=', { e: event });
  if ((event) && (event.submitter) && (event.submitter.name) && (event.submitter.tagName.toLowerCase() == 'input')) {
    // console.log('run_ajax_submit_if_modal submitter detected');
    // fdata[event.submitter.name] = event.submitter.value;
    fdata.append(event.submitter.name, event.submitter.value);
  }

  if (!(params_in)) params_in = {};
  let params = [params_in];

  let $d = $(elem);
  let modal_id = $d.closest('.modal').attr('id');
  $d.attr('params_arr', JSON.stringify(params));
  console.log('started run_ajax_submit_if_modal fdata=', fdata, ' params=', JSON.stringify(params));
  let url = new URL($d.attr('action'), document.location.protocol +'//' + document.location.host);

  let headers = { "AuthToken": getCookie('authorization_hash', true) };
  // let password = '';
  if (url.username.length > 0) {
    headers['Authorization'] = "Basic " + btoa(url.username + ":" + url.password);
    // username = url.username + '';
    // password = url.password + '';
    url.username = '';
    url.password = '';
  }
  // if ($d.attr('method') == 'GET') url.searchParams.append('dialog_wnd_id', 1);
  // console.log('started run_ajax_submit_if_modal url=', url);

  $.ajax({ url: url.href, type: $d.attr('method'), dataType: "json", data: fdata, cache: false, headers: headers,
    contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    processData: false, // NEEDED, DON'T OMIT THIS

    // statusCode: {
    //   222: function(r) {


    //   }
    // },
    success: function(res) {
      console.log('run_ajax_submit_if_modal success res=', res, " this=", this);
      if (res.redirect_to_new_location) {
        let get_params = {};
        if (res.auth_token) {
          get_params.auth_token = res.auth_token;
          // setCookie('authorization_hash', res.auth_token, { expires: 10000, path: '/', DOMAIN: window.location.hostname }, true);
        }
        console.log("page 222 started. get_params=", get_params, " res=", res, " this=", this, 'cookie=', this.cookie);
        // document.cookie = this.cookie;
        fill_modal_from_url($("#" + modal_id)[0], res.redirect_to_new_location, get_params);
        return true;
      }
      let modal_wnd = $d.closest('.form_post_outer_block')[0];
      fill_form_post_outer_block(modal_wnd, res);
      init_js_components(modal_wnd);
      let params_arr = JSON.parse($d.attr('params_arr'));
      let func_name = $d.attr('success_func');
      console.log('run_ajax_submit_if_modal func_name=', func_name, ' params_arr=', JSON.stringify(params_arr));
      window[$d.attr('success_func')](res, modal_id, params_arr);
    },
    error: function(res) {
      console.error('run_ajax_submit_if_modal fail res=', res);
      try {
        let data = JSON.parse(res.responseText);
        console.log('run_ajax_submit_if_modal err data=', data);
        if (data.main_text) {
          let modal_wnd = $d.closest('.form_post_outer_block')[0];
          fill_form_post_outer_block(modal_wnd, data);
          return false;
        }
      } catch(error) {
        console.error(error);
      }
      $d.closest('.form_post_outer_block').html(res.responseText);
    }
  });
  return false;
}

function refresh_cart_page(res, modal_id, params) {
  console.log('started refresh_cart_page res=', res, ' params=', params);
  let m = $('#' + modal_id)[0];
  if (!(res.erorrs_found > 0)) {
    // let m = $(elem).closest('.modal')[0];
    // console.log('refresh_cart_page errors not found! m=', m);
    // $(m).modal('hide');
    // $('#add_comment_form').find('.client_model_errors_block').html(res.flash_html);
    // $('#comments_list_html').html(res.comments_list_html);
    // $('.flash_html_main_block').html(res.flash_html);
    // console.log('refresh_cart_page client_settings=', res.client_settings);
    // let new_vals = JSON.parse(res.client_settings);
    // console.log('refresh_cart_page client_settings new_vals=', new_vals);
    $('.data_val_html_block[html_block_name="main_text"]').html(res.cart_page_full_html);
    sleep(800).then(() => { $('#' + modal_id).modal('hide'); });
  } else {
    console.log('refresh_cart_page errors found=', res.erorrs_found);
  }
}


function refresh_profile_page(res, modal_id, params) {
  console.log('started refresh_profile_page res=', res, ' params=', params);
  let m = $('#' + modal_id)[0];
  if (!(res.erorrs_found > 0)) {
    // let m = $(elem).closest('.modal')[0];
    console.log('refresh_profile_page errors not found! m=', m);
    $(m).modal('hide');
    // $('#add_comment_form').find('.client_model_errors_block').html(res.flash_html);
    // $('#comments_list_html').html(res.comments_list_html);
    $('.flash_html_main_block').html(res.flash_html);
    // console.log('refresh_profile_page client_settings=', res.client_settings);
    // let new_vals = JSON.parse(res.client_settings);
    // console.log('refresh_profile_page client_settings new_vals=', new_vals);
    $('.data_val_html_block[html_block_name="main_text"]').html(res.client_settings_html);
  } else {
    console.log('refresh_profile_page errors found=', res.erorrs_found);
  }
  // let $d = $('#add_comment_form');
  // if (res.err_str.length > 0) {
  //   $d.find('.client_model_errors_block').html(res.err_str);
  // } else {
  //   $d.html('Коментарий успешно добавлен. Спасибо.')
  //   $('#comments_list_html').html(res.comments_list_html);
  // }
}

function cart_delivery_service_chk_changed(elem, d_id, dname) {
  console.log('cart_delivery_service_chk_changed d_id=', d_id);
  let $d = $(elem).closest('.choose_delivery_block');
  let $lab = $d.find('.delivery_show_hide_icons_label');
  $lab.attr('dservice_icon_before', d_id);
  $lab.html(dname);
  let new_delivery_type_id = parseInt($d.find('.dt_dropdown_ds_' + d_id + ' .dropdown_btn').attr('vid'));
  let new_delivery_type_alias       = $d.find('.dt_dropdown_ds_' + d_id + ' .dropdown_btn').attr('val');
  $d.find('.dropdown_hidden_val[name="delivery_type_id"]').attr('value', new_delivery_type_id);
  $d.find('form.cart_pds_modal').attr('delivery_type_id', new_delivery_type_alias);
  console.log('cart_delivery_service_chk_changed new_delivery_type_id=', new_delivery_type_id);
  return false;
}

function refresh_model_items_htmls_in_list(res, modal_id, params_in) {
  let params = (params_in && Array.isArray(params_in)) ? params_in[0] : {};
  if (!(params)) params = {};
  console.log('started refresh_model_items_htmls_in_list res=', res, ' params=', params, ' params_in=', JSON.stringify(params_in));
  // let m = $('#' + modal_id)[0];
  if (!(res.erorrs_found > 0)) {
    let updated_models = JSON.parse('[' + (res.updated_models || "") + ']');
    let need_refresh_page = 0;
    // console.log('updated_models=', updated_models);
    updated_models.forEach(function(el) {
      let $elems = $('.list_item_block[list_item_model="' + el.model_name + '"][list_item_id="' + el.model_id + '"]');
      if ($elems.length > 0) {
        let row_num = parseInt($elems.attr('item_num'));
        if (el.new_item_html.length > 0) el.list_html = $(el.new_item_html)[0].innerHTML;
        $elems.html(el.list_html);
        if (row_num > 0) $elems.find('.item_num_html').html(row_num);
      } else {
        if ((el.new_item_html) && (el.list_class)) {
          $('.' + el.list_class).append(el.new_item_html);
        } else {
          console.log('Not found ' + el.model_name + '[' + el.model_id + ']. So need_refresh_page!');
          need_refresh_page = 1;
        }
      }
    });
    if ((need_refresh_page > 0) && (!(params.ignore_refresh > 0))) {
      document.location.href = document.location.href;
      return false;
    }
  } else {
    console.log('refresh_model_items_htmls_in_list errors found=', res.erorrs_found);
  }
}

function edit_field_file_changed(inp_elem) { console.log('edit_field_file_changed inp_elem[name]=' + inp_elem.name); }

function submit_favorite_edit_form(res) {
  console.log('started submit_favorite_edit_form res=', res);
  $('#' + res.modal_id).find('#favorite_edit_form button[type="submit"]').click();
}

function recalc_discont_itogo_price(elem) {
  console.log('started recalc_discont_itogo_price elem=', elem);
}

function refresh_model_items_htmls_in_list_and_close_modal(res, modal_id, params) {
  // console.log('refresh_model_items_htmls_in_list_and_close_modal2 params=', params);
  if (!(res.erorrs_found > 0)) {
    refresh_model_items_htmls_in_list(res, modal_id, params)
    sleep(800).then(() => {
      $('#' + modal_id).modal('hide');
      // console.log('refresh_model_items_htmls_in_list_and_close_modal3 params=', params);
      if ((params) && (params.length > 0) && (params[0].close_all_modals)) {
        // console.log('refresh_model_items_htmls_in_list_and_close_modal3 run close_all_modals');
        $('.modal').modal('hide');
      } else {
        // console.log('refresh_model_items_htmls_in_list_and_close_modal3 close_all_modals missing');
      }
    });
  } else {
    console.log('refresh_model_items_htmls_in_list_and_close_modal errors found=', res.erorrs_found);
  }
}

function set_zero_raiting(elem) {
  let $d = $(elem).closest('.stars_rating_block');
  $d.find('input[name="rating_val"]').val("0");
  $d.find('.stars_rating').find('i').attr('tunedoff', 1);
  if ($(elem).closest('.form_edit_link_block').length > 0) form_edit_link_changed($d.find('input[name="rating_val"]')[0]);
  return false;
}

function set_stars_raiting(elem, ev) {
  console.log('set_stars_raiting event=', ev, ' elem=', elem, ' src=', ev.srcElement);
  // let item_pressed = ev.path[0];
  let item_pressed = ev.srcElement;
  let $d = $(elem).closest('.stars_rating_block');
  console.log('set_stars_raiting item_pressed=', item_pressed , ' event=', ev, ' elem=', elem);
  let pressed_val = 0;
  let found_pressed = false;
  $d.find('.stars_rating').find('i').each(function (i) {
    let i_item = this;
    let $r = $(i_item);
    if (found_pressed) {
      $r.attr('tunedoff', 1);
    } else {
      pressed_val = pressed_val + 1;
      $r.attr('tunedoff', 0);
    }
    if (item_pressed == i_item) found_pressed = true;
  });
  $d.find('input[type="hidden"]').val(pressed_val);
  // console.log('pressed_val=', pressed_val);
  if ($(elem).closest('.form_edit_link_block').length > 0) form_edit_link_changed($d.find('input[name="rating_val"]')[0]);
}

function refresh_comments_in_list_and_close_modal(res, modal_id, params) {
  if (!(res.erorrs_found > 0)) {
    refresh_model_items_htmls_in_list_and_close_modal(res, modal_id, params);
    let updated_models = JSON.parse('[' + (res.updated_models || "") + ']');
    // console.log('updated_models=', updated_models);
    updated_models.forEach(function(el) {
      let $mr = $('.list_item_block[list_item_model="' + el.model_name + '"][list_item_id="' + el.model_id + '"]');
      if (!($mr.length > 0)) {
        if (el.parent_id > 0) {
          let $t = $('.comment_childs_table[c_id="' + el.parent_id + '"]');
          fill_block_from_url($t.children('tbody')[0]);
        } else {
          fill_block_from_url($('.main_comments_list_html')[0]);
        }
      }
    });
  }
}

function show_nested_comments(elem) {
  console.log('started show_nested_comments');
  let $d = $(elem).closest('.list_item_block');
  let comment_id = parseInt($d.attr('list_item_id'));
  if (comment_id > 0) {
    let $t = $d.find('.comment_childs_table[c_id="' + comment_id + '"]');
    let $td = $t.closest('td');
    let new_opened = 1 - parseInt($td.attr('opened_childs'));
    $td.attr('opened_childs', new_opened);
    if (new_opened > 0) fill_block_from_url($t.children('tbody')[0]);
  }
  return false;
}


function open_close_unread_childs(elem) {
  let $d = $(elem).closest('.prod_comment_tr');
  let comment_id = parseInt($d.attr('list_item_id'));
  console.log('started open_close_unread_childs comment_id=', comment_id);
  if (comment_id > 0) {
    let $t = $d.find('.client_product_comment_childs_table[c_id="' + comment_id + '"]');
    let $td = $t.closest('td');
    let new_opened = 1 - parseInt($td.attr('opened_childs'));
    console.log('open_close_unread_childs td=', $td,' new_opened=', new_opened);
    $td.attr('opened_childs', new_opened);
    if (new_opened > 0) fill_block_from_url($t.children('tbody')[0]);
  }
  return false;
}

function multi_items_chk_changed(elem) {
  let $d = $(elem).closest('.all_found_items_table_block');
  let chk_ids = $d.find('.all_items_list_table .multi_items_chk:checked').map(function() { return parseInt($(this).attr('value')); }).toArray().sort();
  console.log('chk_ids=', chk_ids);
  let $link = $d.find('.multi_items_work_with_selected_btn');
  let new_href = $link.attr('href').replace(/\&selected_ids=[\d\,]*/, '&selected_ids=' + chk_ids.join(','));
  $link.attr('href', new_href);
  $d.attr('selected_count', chk_ids.length);
  return false;
}

function multi_items_select_all(elem) {
  let $d = $(elem).closest('.all_found_items_table_block');
  let cur_val = (parseInt($d.attr('checked_val'))) ? 1 : 0;
  $d.attr('checked_val', 1 - cur_val);
  let new_val = (cur_val > 0) ? false : true;
  $d.find('.all_items_list_table .multi_items_chk').prop('checked', new_val);
  multi_items_chk_changed(elem);
  return false;
}

function tabs_switcher_radio_changed(elem) {
  let $d = $(elem).closest('.tabs_radio_block');
  let cur_tab_val = $d.children('.tabs_switcher_radio:checked').attr('value');
  $d.children('.tab_radio_label').attr('selected_tab', 0);
  $d.children('.tab_radio_label[for="tabs_switcher_radio_' + cur_tab_val + '"]').attr('selected_tab', 1);
  $d.find('.visible_only_one').attr('hidden_now', 1);
  $d.find('.visible_only_one[visible_only="' + cur_tab_val + '"]').attr('hidden_now', 0);
  return false;
}

function date_range_utf_changed(elem) {
  console.log('date_range_utf_changed');
  if (!($(elem).attr('ignore_submit_on_apply') > 0)) {
    console.log('date_range_utf_changed try submit form');
    $(elem).closest('form').submit();
  }
}

function coupon_used(res, modal_id, params_arr) {
  console.log('runned coupon_used');
  document.location.href = trade_url() + '/ru/cart';
  return false;
}



