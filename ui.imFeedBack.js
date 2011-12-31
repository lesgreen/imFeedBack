/*
 * 	 ui.imFeedBack - A JQuery UI Feedback Widget 
 * 	 @author Les Green
 * 	 Copyright (C) 2010 Intriguing Minds, Inc.
 * 
 *   Version 0.6 30 Dec 2011
 *   1. Fixed problem so that the widget will work in IE
 * 
 *   Version 0.5
 * 
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.

 *   Demo and Documentation can be found at:   
 *   http://www.grasshopperpebbles.com
 *   
 */

 (function($) {

$.widget("ui.imFeedBack", {

	_init: function() {
		o = this.options;
		_self = this;
		feedBackOpen = false;
		_self.buildSideFeedbackBtn();
	},
	
	buildSideFeedbackBtn: function() {
		$('<div></div>').attr('id', 'imFeedBack-container').css('position', 'fixed').css(o.location, '0px').appendTo(this.element);
		
		var frm, tf;
		var sH = parseInt(screen.height);
		
		var cH = parseInt($('#imFeedBack-container').height());
		var mT = (sH - cH)/2;
		if ($.browser.webkit || $.browser.safari) {
			mT = mT - 100;
		}
		$('#imFeedBack-container').css('margin-top', mT+'px');
		
		var btn = $('<button></button>').attr({'id': 'imFeedBack-Button', 'class': o.feedback_button_class}).append($('<span></span>')).html(o.feedback_button_text);		
		
		if (o.show == 'slide') {
			frm = _self.getFeedBackForm();
		} else {
			tf = _self.buildDialogFeedback();
		}
		if (o.form_capture_name) {
			tf = _self.formCaptureName();
		}
			
		if (o.location == 'right') {
			$(btn).addClass('imFeedBack-Button-right');
			if (o.show == 'slide') {
				$('#imFeedBack-container').append($(btn), $(frm));
			}	
		} else {
			if ($(btn).hasClass('ui-corner-top')) {
				$(btn).removeClass('ui-corner-top').addClass('ui-corner-bottom');
			}
			$(btn).addClass('imFeedBack-Button-left');
			if (o.show == 'slide') {
				$('#imFeedBack-container').append($(frm), $(btn));
			}
		}
		if (o.show == 'slide') {
			$('#imFeedBack-Form').prepend($('<h3></h3>').attr('class', o.header_class).html(o.header_caption));
			$('#imFeedBack-Message').after(
				$('<button></button>').attr({'id': 'imFeedBack-Button-Send', 'type': 'button', 'class': o.form_button_class}).html('Send'),
				$('<button></button>').attr({'id': 'imFeedBack-Button-Cancel', 'type': 'button', 'class': o.form_button_class}).html('Close'));
		}
		if (o.show == 'dialog') {
			$('#imFeedBack-container').append($(btn));
		}
		var bH = $('#imFeedBack-Button').width();
		var mT = (parseInt(mT) - bH)/2 +'px';
		$('#imFeedBack-Button').css('margin-top', mT);
		
		$('#imFeedBack-Button').hover(
			function() {
				if (o.feedback_button_class_hover) {
					$(this).addClass(o.feedback_button_class_hover).css('cursor', 'pointer');
				} else {
					$(this).css('cursor', 'pointer');
				} 
			}, 
			function() { 
				if (o.feedback_button_class_hover) {
					$(this).removeClass(o.feedback_button_class_hover).css('cursor', 'default');
				} else {
					$(this).css('cursor', 'default');
				}	
			}
		);
		var feedBackBtns = (o.external_control) ? '#imFeedBack-Button, #' + o.external_control.id : '#imFeedBack-Button'; 
		$(feedBackBtns).click(function() {
			//console.log($(this).attr('id'));
			if ($(this).attr('id') == o.external_control.id) {
				if (o.external_control.top_text) {
					$('imFeedBack-Top-Text').html(o.external_control.top_text);
				}
				if (o.external_control.feedback_subject) {
					$('#imFeedBack-Subject').val(o.external_control.feedback_subject);
				}
			}
			_self.toggleText(); 
			if (o.show == 'slide') {
				$('#imFeedBack-FormContainer').toggle("slow");
			} else {
				$('#' + o.dialog_container).dialog('open');
			}
			/*feedBackOpen = (feedBackOpen == false);
			if (!feedBackOpen) {
				$('imFeedBack-Top-Text').html(o.top_text);
				$('#imFeedBack-Subject').val(o.feedback_subject);
			}*/
		});
		$('#imFeedBack-Button-Send, #imFeedBack-Button-Cancel').hover(
			function() {
				if (o.form_button_class_hover) {
					$(this).addClass(o.form_button_class_hover).css('cursor', 'pointer');
				} else {
					$(this).css('cursor', 'pointer');
				} 
			}, 
			function() { 
				if (o.form_button_class_hover) {
					$(this).removeClass(o.form_button_class_hover).css('cursor', 'default');
				} else {
					$(this).css('cursor', 'default');
				}	
			}
		);
		$('#imFeedBack-Button-Send').click(function() {
			_self.sendFeedBack();
		});
		$('#imFeedBack-Button-Cancel').click(function() {
			_self.closeFeedBackCntnr();	
		});
	},
	
	buildDialogFeedback: function() {
		if (o.dialog_widget_form) {
			$(document.body).append($('<div></div>').attr('id', o.dialog_container));
			var frm = _self.getFeedBackForm();
			$('#'+ o.dialog_container).append($(frm));
			$('#imFeedBack-FormContainer').removeClass(o.form_container_class);
			$('#imFeedBack-FormContainer').show();
		}
		
		$('#'+o.dialog_container).dialog({ 
	    	buttons: { 
	    		"Send": function() {
					_self.sendFeedBack();
	    		}, 
	    		"Close": function() { 
					_self.closeFeedBackCntnr();
	       			//$(this).dialog("close");
	   			} 
	   		}, 
			width: o.dialog_width,
			modal: true, 
			autoOpen: false, 
			title: o.header_caption
		});
		return true;
	},
	
	getFeedBackForm: function() {
		var h = '';
		$.each(o.hidden_fields, function (i, itm) {
			h += '<input type="hidden" name="' + itm.name + '" value="' + itm.value + '" />';
		});
		var frm = $('<div></div>').attr({
			'id': 'imFeedBack-FormContainer',
			'class': o.form_container_class
		}).css('float', o.location).append($('<form></form>').attr({'id': 'imFeedBack-Form'}).html(h).append(
						$('<div></div>').attr('id', 'imFeedBack-Top-Text').html(o.top_text),
						$('<label></label>').html('Email:'),
						$('<input type="text" name="imFeedBack-Email" id="imFeedBack-Email" />'),
						$('<label></label>').html('Subject:'),
						$('<input></input>').attr({'name': 'imFeedBack-Subject', 'id': 'imFeedBack-Subject'}).val(o.feedback_subject),
						$('<label></label>').html('Message:'),
						$('<textarea></textarea>').attr({'name': 'imFeedBack-Message', 'id': 'imFeedBack-Message'}),
						$('<div></div>').attr('id', 'imFeedBack-Response')
					)
		);
		return frm;
	},
	
	formCaptureName: function() {
		if (o.form_capture_name == 'firstName') {
			$('#imFeedBack-Top-Text').after(
				$('<label></label>').text('First Name:'),
				$('<input type="text" name="imFeedBack-FirstName" id="imFeedBack-FirstName" />')
			);
		} else if (o.form_capture_name == 'fullName') {
			$('#imFeedBack-Top-Text').after(
				$('<label></label>').text('Name:'),
				$('<input type="text" name="imFeedBack-Name" id="imFeedBack-Name" />')
			);
		} else if (o.form_capture_name == 'firstLast') {
			$('#imFeedBack-Top-Text').after(
				$('<label></label>').text('First Name:'),
				$('<input type="text" name="imFeedBack-FirstName" id="imFeedBack-LastName" />'),
				$('<label></label>').text('Last Name:'),
				$('<input type="text" name="imFeedBack-LastName" id="imFeedBack-LastName" />')
			);
		}
		return true;
	},
	
	sendFeedBack: function() {
		var validForm = _self.validateForm();
		if (validForm == true) {
			_self.doAjax('POST', o.submit_url, $('#imFeedBack-Form').serialize(), '', _self.showSuccess);
		} else {
			$('#imFeedBack-Response').html(validForm);
		}	
	},
	
	closeFeedBackCntnr: function() {
		if (o.show == 'slide') {
			$('#imFeedBack-FormContainer').hide("slow");
		} else {
			$('#'+o.dialog_container).dialog("close");
		}
		_self.toggleText();
	},
	
	toggleText: function() {
		feedBackOpen = (feedBackOpen == false);
		if (!feedBackOpen) {
			$('imFeedBack-Top-Text').html(o.top_text);
			$('#imFeedBack-Subject').val(o.feedback_subject);
		}
	},
	
	validateForm: function() {
		var rVal = true;
		if (!_self.isValidEmail($('#imFeedBack-Email').val())) {
			rVal = 'You must enter a valid email address';
		} else if ($('#imFeedBack-Subject').val() == '') {
			rVal = 'You must enter a subject';
		} else if ($('#imFeedBack-Message').val() == '') {
			rVal = 'You must enter a message';
		} 
		return rVal; 
	},
	
	isValidEmail: function(val) {
		var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
		if (filter.test(val)) {
			return true;
		} else {
			return false;
		}
	},
	
	doAjax: function (t, u, d, fnBefore, fnSuccess) {
		$.ajax({
			type: t,
			url: u,
			data: d,
			dataType: 'json',
			beforeSend: fnBefore, 
			success: fnSuccess,
			error: _self.showError
	 	}); //close $.ajax(
	},
	
	showError: function (XMLHttpRequest, textStatus, errorThrown) {
		console.log(textStatus);
	},

	showSuccess: function (result) {
		//$('#imFeedBack-Response').empty();
		if (result.response == 'Message Sent') {
			var msg = (o.success_msg) ? o.success_msg : result.response;
			$('#imFeedBack-Response').html(msg);
		} else {
			$('#imFeedBack-Response').html(result.response);
		}
	},

	destroy: function() {
		$.widget.prototype.destroy.apply(this, arguments);
		return this;
	}

});

$.extend($.ui.imFeedBack, {
	version: "@VERSION",
	defaults: {
		location: 'right', //left
		show: 'slide', //dialog
		dialog_container: 'imFeedBack-dialog',// used only if location = dialog
		dialog_widget_form: true, //if true, email form will be built
		dialog_width: '550px',
		form_container_class: 'ui-widget ui-widget-content ui-corner-all',
		form_button_class: 'fg-button ui-state-default ui-corner-all',
		form_button_class_hover: 'ui-state-hover',
		form_capture_name: false, // firstName, fullName, firstLast
		feedback_subject: '',
		header_class: 'ui-widget-header ui-corner-top',
		header_caption: 'Please Send Us an Email',
		top_text: '',
		feedback_button_class: 'fg-button ui-state-default ui-corner-top', 
		feedback_button_class_hover: 'ui-state-hover',
		feedback_button_text: 'FeedBack',
		hidden_fields: '', //[ {name: "img_type", value: "P"}, {name: "action", value: "doAdd"}, {name: "page", value: "member_images"} ]
		submit_url: '',
		success_msg: 'Thank you for contacting us. We will get back to you as soon as we can.',
		external_control: '', //{ id: 'webDesignBtn', top_text: '', feedback_subject: ''}
	}
});

})(jQuery);