import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import {deepEquals} from 'react-jsonschema-form/lib/utils';


import {
  getDefaultFormState,
  orderProperties,
  retrieveSchema,
  shouldRender,
  getDefaultRegistry,
  setState
} from 'react-jsonschema-form/lib/utils';


function objectKeysHaveChanged(formData, state) {
  // for performance, first check for lengths
  const newKeys = Object.keys(formData);
  const oldKeys = Object.keys(state);
  if (newKeys.length < oldKeys.length) {
    return true;
  }
  // deep check on sorted keys
  if (!deepEquals(newKeys.sort(), oldKeys.sort())) {
    return true;
  }
  return false;
}

class ObjectField extends Component {
  static defaultProps = {
    uiSchema: {},
    errorSchema: {},
    idSchema: {},
    registry: getDefaultRegistry(),
    required: false,
    disabled: false,
    readonly: false,
  };

  constructor(props) {
    super(props);
    this.state = {...this.getStateFromProps(props)};
  }

  componentWillReceiveProps(nextProps) {
    const state = this.getStateFromProps(nextProps);
    const {formData} = nextProps;
    if (formData && objectKeysHaveChanged(formData, this.state)) {
      // We *need* to replace state entirely here has we have received formData
      // holding different keys (so with some removed).
      this.state = state;
      this.forceUpdate();
    } else {
      this.setState(state);
    }
  }

  getStateFromProps(props) {
    const {schema, formData, registry} = props;
    return getDefaultFormState(schema, formData, registry.definitions) || {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  isRequired(name) {
    const schema = this.props.schema;
    return Array.isArray(schema.required) &&
      schema.required.indexOf(name) !== -1;
  }

  asyncSetState(state, options = {validate: false}) {
    setState(this, state, () => {
      this.props.onChange(this.state, options);
    });
  }

  onPropertyChange = name => {
    return (value, options) => {
      this.filterSchemaProperties(name, value, options);
    };
  };

  hiddenContent = false;

  onTitleClick = () => {
    this.hiddenContent = !this.hiddenContent;
    this.forceUpdate();
  };

  filterSchemaProperties = (name, value, options) => {
    const {definitions} = this.props.registry;
    const baseSchema = retrieveSchema(this.props.schema, definitions);
    const {propertiesLogic = {}} = baseSchema;
    const newState = {[name]: value};
    const logic = propertiesLogic[name];

    if (logic) {
      if (logic[value]) {
        const {hide} = logic[value];

        if (hide) {
          hide.forEach(property => {
            newState[property] = undefined;
          });
        }
      }
    }

    this.asyncSetState(newState, options);
  };

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly
    } = this.props;
    const {definitions, fields, formContext} = this.props.registry;
    const {SchemaField, TitleField, DescriptionField} = fields;
    const baseSchema = retrieveSchema(this.props.schema, definitions);
    const title = (baseSchema.title === undefined) ? name : baseSchema.title;
    const {propertiesLogic = {}} = baseSchema;
    const schema = _.cloneDeep(baseSchema);

    Object.keys(propertiesLogic).forEach(key => {
      const property = propertiesLogic[key];

      Object.keys(property).forEach(value => {
        const actions = property[value];
        const {hide} = actions;

        hide.forEach(propertyKey => {
          if (this.state[key] === value) {
            delete schema.properties[propertyKey];
          }
        });
      });
    });

    let orderedProperties;
    let maxHeight = 'none';
    try {
      const properties = Object.keys(schema.properties);
      // formElemHeight: current max height of SchemaField, needed to estimate max height of div with nested elements
      const formElemHeight = 75;
      orderedProperties = orderProperties(
        properties, schema.propertiesOrder.filter(item => properties.includes(item)) || uiSchema['ui:order']
      );
      maxHeight = title ? orderedProperties.length * formElemHeight : 'none';
    } catch (err) {
      return (
        <div>
          <p className='config-error' style={{color: 'red'}}>
            Invalid {name || 'root'} object field configuration:
            <em>{err.message}</em>.
          </p>
          <pre>{JSON.stringify(schema)}</pre>
        </div>
      );
    }
    return (
      <fieldset className="gohan-reset-fieldset">
        {title ? <TitleField id={`${idSchema.$id}__title`}
          title={title}
          required={required}
          formContext={formContext}
          hiddenContent={this.hiddenContent}
          onClick={this.onTitleClick}
        /> : null}
        {schema.description ?
          <DescriptionField id={`${idSchema.$id}__description`}
            description={schema.description}
            formContext={formContext}
          /> : null}
        <div className={`gohan-form-object-children
                    ${this.hiddenContent ? 'gohan-hidden-content' : 'gohan-shown-content'}`}
          style={{
            maxHeight: this.hiddenContent ? 0 : maxHeight
          }}>
          {
            orderedProperties.map((name, index) => {
              return (
                <SchemaField key={index}
                  name={name}
                  required={this.isRequired(name)}
                  schema={schema.properties[name]}
                  uiSchema={uiSchema[name]}
                  errorSchema={errorSchema[name]}
                  idSchema={idSchema[name]}
                  formData={this.state[name]}
                  onChange={this.onPropertyChange(name)}
                  registry={this.props.registry}
                  disabled={disabled}
                  readonly={readonly}
                />
              );
            }
            )}
        </div>
      </fieldset>
    );
  }
}

if (process.env.NODE_ENV !== 'production') {
  ObjectField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    errorSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
      ])).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    })
  };
}

export default ObjectField;