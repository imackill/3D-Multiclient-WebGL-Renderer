let ui;
function createUI(){
    return ui = {
        main: {
            html:$(`<div id="uicontainer"></div>`),
            id:`uicontainer`
        },
        chat: {
            html:$(`<div id="uichatbox"></div>`),
            id:`uichatbox`
        },
        text_input: {
            html:$(`<input type="text" value="" id="chatinput"/>`),
            id:`chatinput`
        },
        form_submit: {
            html:$(`<input type="submit" id="formsubmit" style="display: none"/>`),
            id:`formsubmit`
        },
        form: {
            html:$(`<form id="chatform"  onsubmit="ui.onsubmit()" ></form>`),
            id:`chatform`
        },
        onsubmit: () => {
            console.log($(`#${ui.text_input.id}`).val());
            $(`#${ui.text_input.id}`).val(``);
        },
    }
}
createUI();
$("body").append(ui.main.html);
$(`#${ui.main.id}`).append(ui.chat.html,ui.text_input.html,ui.form.html);
$(`#${ui.form.id}`).append(ui.form_submit.html);