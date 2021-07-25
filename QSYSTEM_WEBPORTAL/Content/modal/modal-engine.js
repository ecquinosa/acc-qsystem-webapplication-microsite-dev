$(function () {
    loadModalWContent = function (modalId, title, content) {
        $("#" + modalId).on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            $(this).find('.modal-title').text(title);
            $(this).find('.modal-body').text(content);
        });

        $('#' + modalId).modal({ backdrop: 'static', keyboard: true, show: true });
    };

    loadConfirmModalWithRedirectLink = function (title, text, data, sLink, rLink) {
        var modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"/>');
        var modalId = "confirm-submit-modal";
        modal.attr('id', modalId);
        var modalDialog = $('<div class="modal-dialog"/>');
        var modalContent = $('<div class="modal-content"/>');
        var modalHeader = $('<div class="modal-header">' + title + '</div>');
        var modalBody = $('<div class="modal-body"/>');
        modalBody.html(text);
        var modalFooter = $('<div class="modal-footer"/>');
        var modalFooterContent = $('<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Cancel</button><a href="#" id="btnConfirm" data-dismiss="modal" class="btn btn-primary btn-sm success">Submit</a>');

        modal.append(modalDialog.append(modalContent
            .append(modalHeader)
            .append(modalBody)
            .append(modalFooter
                .append(modalFooterContent))));

        $('.section-content').append(modal);

        $("#" + modalId).on('hidden.bs.modal', function () {
            $(this).remove();
        })

        $("#" + modalId).modal({ backdrop: 'static', keyboard: true, show: true });


        $('#btnConfirm').click(function () {
            $.ajax({
                type: 'POST',
                url: sLink,
                data: data,
                beforeSend: function () {
                    $('#btnSubmit').button('loading');
                },
                success: function (response) {
                    if (response.Code == 204 || response.Code == 201 || response.Code == 202) {
                        window.location.href = rLink;
                    }
                },
                error: function (xhr, st, err) {
                    loadModalWContent('notifyError', 'Error', xhr.responseJSON.Message || "There was an unhandled problem!");
                    $('#btnSubmit').button('reset');
                }
            });
        });
    };

    loadConfirmModal = function (title, text, link, data) {
        var modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"/>');
        var modalId = "confirm-submit-modal";
        modal.attr('id', modalId);
        var modalDialog = $('<div class="modal-dialog"/>');
        var modalContent = $('<div class="modal-content"/>');
        var modalHeader = $('<div class="modal-header">' + title + '</div>');
        var modalBody = $('<div class="modal-body"/>');
        modalBody.html(text);
        var modalFooter = $('<div class="modal-footer"/>');
        var modalFooterContent = $('<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Cancel</button><a href="#" id="btnConfirm" data-dismiss="modal" class="btn btn-primary btn-sm success">Submit</a>');

        modal.append(modalDialog.append(modalContent
            .append(modalHeader)
            .append(modalBody)
            .append(modalFooter
                .append(modalFooterContent))));

        $('.section-content').append(modal);

        $("#" + modalId).on('hidden.bs.modal', function () {
            $(this).remove();
        })

        $("#" + modalId).modal({ backdrop: 'static', keyboard: true, show: true });

        $('#btnConfirm').click(function () {
            $.ajax({
                type: 'POST',
                url: link,
                data: data,
                beforeSend: function () {
                    $('#btnSubmit').button('loading');
                },
                success: function (response) {
                    if (response.Code == 204 || response.Code == 201 || response.Code == 202) {
                        loadModalWContent('notifySuccess', 'Success', response.Message);
                    }
                },
                error: function (x, y, z) {
                    loadModalWContent('notifyError', 'Error', x.responseJSON.Message || "There was an unhandled problem!");
                    $('#btnSubmit').button('reset');
                }
            }).done(function (data) {
                $('#btnSubmit').button('reset');
            });
        });
    }


    loadConfirmModalWithCallback = function (fn, title, text, link, data, modalFormId) {
        var modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"/>');
        var modalId = "confirm-submit-modal";
        modal.attr('id', modalId);
        var modalDialog = $('<div class="modal-dialog"/>');
        var modalContent = $('<div class="modal-content"/>');
        var modalHeader = $('<div class="modal-header">' + title + '</div>');
        var modalBody = $('<div class="modal-body"/>');
        modalBody.html(text);
        var modalFooter = $('<div class="modal-footer"/>');
        var modalFooterContent = $('<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Cancel</button><a href="#" id="btnConfirm" data-dismiss="modal" class="btn btn-primary btn-sm success">Submit</a>');

        modal.append(modalDialog.append(modalContent
            .append(modalHeader)
            .append(modalBody)
            .append(modalFooter
                .append(modalFooterContent))));

        $('.section-content').append(modal);

        $("#" + modalId).on('hidden.bs.modal', function () {
            $(this).remove();
        })

        $("#" + modalId).modal({ backdrop: 'static', keyboard: true, show: true });


        $('#btnConfirm').click(function () {
            $.ajax({
                type: 'POST',
                url: link,
                data: data,
                beforeSend: function () {
                },
                success: function (response) {
                    if (response.Code == 204 || response.Code == 201 || response.Code == 202) {
                        fn();
                        loadModalWContent('notifySuccess', 'Success', response.Message);
                    }
                },
                error: function (x, y, z) {
                    loadModalWContent('notifyError', 'Error', x.responseJSON.Message || "There was an unhandled problem!");
                }
            }).done(function (data) {
                (modalFormId != "") ? $("#" + modalFormId).modal('toggle') : "";
            });
        });
    }

    loadConfirmModalWithCallbackWithToken = function (fn, title, text, link, data, modalFormId) {
        var token = $('[name=__RequestVerificationToken]').val();
        var modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"/>');
        var modalId = "confirm-submit-modal";
        modal.attr('id', modalId);
        var modalDialog = $('<div class="modal-dialog"/>');
        var modalContent = $('<div class="modal-content"/>');
        var modalHeader = $('<div class="modal-header">' + title + '</div>');
        var modalBody = $('<div class="modal-body"/>');
        modalBody.html(text);
        var modalFooter = $('<div class="modal-footer"/>');
        var modalFooterContent = $('<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Cancel</button><a href="#" id="btnConfirm" data-dismiss="modal" class="btn btn-primary btn-sm success">Submit</a>');

        modal.append(modalDialog.append(modalContent
            .append(modalHeader)
            .append(modalBody)
            .append(modalFooter
                .append(modalFooterContent))));

        $('.section-content').append(modal);

        $("#" + modalId).on('hidden.bs.modal', function () {
            $(this).remove();
        })

        $("#" + modalId).modal({ backdrop: 'static', keyboard: true, show: true });


        $('#btnConfirm').click(function () {
            $.ajax({
                type: 'POST',
                url: link,
                headers: { '__RequestVerificationToken': token },
                data: data,
                beforeSend: function () {
                },
                success: function (response) {
                    if (response.Code == 204 || response.Code == 201 || response.Code == 202) {
                        fn();
                        loadModalWContent('notifySuccess', 'Success', response.Message);
                    }
                },
                error: function (x, y, z) {
                    loadModalWContent('notifyError', 'Error', x.responseJSON.Message || "There was an unhandled problem!");
                }
            }).done(function (data) {
                (modalFormId != "") ? $("#" + modalFormId).modal('toggle') : "";
            });
        });
    }

    loadConfirmModalWithUploadWithCallbackWithToken = function (fn, title, text, link, data, modalFormId) {
        var token = $('[name=__RequestVerificationToken]').val();
        var modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"/>');
        var modalId = "confirm-submit-modal";
        modal.attr('id', modalId);
        var modalDialog = $('<div class="modal-dialog"/>');
        var modalContent = $('<div class="modal-content"/>');
        var modalHeader = $('<div class="modal-header">' + title + '</div>');
        var modalBody = $('<div class="modal-body"/>');
        modalBody.html(text);
        var modalFooter = $('<div class="modal-footer"/>');
        var modalFooterContent = $('<button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Cancel</button><a href="#" id="btnConfirm" data-dismiss="modal" class="btn btn-primary btn-sm success">Submit</a>');

        modal.append(modalDialog.append(modalContent
            .append(modalHeader)
            .append(modalBody)
            .append(modalFooter
                .append(modalFooterContent))));

        $('.section-content').append(modal);

        $("#" + modalId).on('hidden.bs.modal', function () {
            $(this).remove();
        })

        $("#" + modalId).modal({ backdrop: 'static', keyboard: true, show: true });


        $('#btnConfirm').click(function () {
            $.ajax({
                type: 'POST',
                url: link,
                headers: { '__RequestVerificationToken': token },
                data: data,
                contentType: false,
                processData: false,
                beforeSend: function () {
                },
                success: function (response) {
                    if (response.Code == 204 || response.Code == 201 || response.Code == 202) {
                        fn();
                        loadModalWContent('notifySuccess', 'Success', response.Message);
                    }
                },
                error: function (x, y, z) {
                    loadModalWContent('notifyError', 'Error', x.responseJSON.Message || "There was an unhandled problem!");
                }
            }).done(function (data) {
                (modalFormId != "") ? $("#" + modalFormId).modal('toggle') : "";
            });
        });
    }
});