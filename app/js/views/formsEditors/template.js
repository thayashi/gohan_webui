import Backbone from 'backbone';
import _ from 'underscore';

import 'backbone-forms';
import 'backbone-forms/distribution/adapters/backbone.bootstrap-modal';

const Form = Backbone.Form;
Form.template = _.template(
  '<form class="" role="form">' +
  '  <div id="alerts_form"></div>' +
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

Form.NestedField.template = _.template(
  '<div class="nested-form-group field-<%= key  %>">' +
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

Form.editors.Base.prototype.className = 'form-control';
Form.Field.errorClassName = 'has-error';
