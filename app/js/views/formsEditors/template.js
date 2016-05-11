import Backbone from 'backbone';
import _ from 'underscore';

import 'backbone-forms';
import 'backbone-forms/distribution/adapters/backbone.bootstrap-modal';

const Form = Backbone.Form;

Form.template = _.template(
  '<form class="" role="form">' +
  '  <div data-fieldsets></div>' +
  '</form>'
);

Form.Fieldset.template = _.template(
  '<fieldset data-fields>' +
  '  <% if (legend) { %>' +
  '  <legend><%= legend %></legend>' +
  '  <% } %>' +
  '</fieldset>'
);

Form.Field.template = _.template(
  '<div class="form-group field-<%= key %>">' +
  '  <label class="control-label" for="<%= editorId %>"><%= title %></label>' +
  '  <% if (help) { %>' +
  '  <span class="help-description"> <%= help %></span>' +
  '  <% } %>' +
  '  <div class="controls">' +
  '    <span data-editor></span>' +
  '    <div class="help-block"><span class="error" data-error></span></div>' +
  '  </div>' +
  '</div>'
);

// Form.NestedField.template = _.template(
//   '<div class="field-<%= key %>">' +
//   '  <div title="<% if (titleHTML){ %><%= titleHTML %><% } else { %><%- title %><% } %>" class="input-xlarge">' +
//   '    <span data-editor></span>' +
//   '    <div class="help-inline" data-error></div>' +
//   '  </div>' +
//   '  <div class="help-block"><%= help %></div>' +
//   '</div>'
// );

Form.editors.Base.prototype.className = 'form-control';
Form.editors.Checkbox.prototype.className = 'checkbox';
Form.editors.Checkboxes.prototype.className = 'checkbox';
Form.Field.errorClassName = 'has-error';

if (Form.editors.List) {
  // Form.editors.List.template = _.template(
  //   '<div class="bbf-list">' +
  //   '  <ul class="ui-sortable" data-items></ul>' +
  //   '  <button type="button" class="btn bbf-add" data-action="add">Add</button>' +
  //   '</div>'
  // );

  // Form.editors.List.Item.template = _.template(
  //   '<li class="bbf-list-item"><% console.log(this) %>' +
  //   '  <a href="#" style="display: inline;">' +
  //   '    <i class="glyphicon glyphicon-remove" style="float:right;" data-action="remove" title="Remove item"></i>' +
  //   '  </a>' +
  //   '  <span data-editor></span>' +
  //   '</li>'
  // );
  Form.editors.List.template = _.template(
    '<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true" data-items>' +
    '  <button type="button" class="btn bbf-add" data-action="add">Add</button>' +
    '</div>'

  );

  Form.editors.List.Item.template = _.template(
  '<div class="panel panel-default">' +
    '<div class="panel-heading" role="tab" id="heading<%= this.cid %>">' +
      '<h4 class="panel-title">' +
        '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#<%= this.cid %>" aria-expanded="false" aria-controls="<%= this.cid %>">' +
          'Collapsible Group Item #1' +
        '</a>' +
      '</h4>' +
    '</div>' +
    '<div id="<%= this.cid %>" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading<%= this.cid %>" data-editor>' +
    '</div>' +
  '</div>'
  );

  Form.editors.List.Object.template = Form.editors.List.NestedModel.template = _.template(
    '<div class="bbf-list-modal"><%= summary %></div>'
  );
}
