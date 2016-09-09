/* global $ */
import Backbone from 'backbone';
import 'backbone-forms';

class SelectEditor extends Backbone.Form.editors.Select {
  setValue(value) {
    if (value) {
      super.setValue(value);
    }
  }

  render() {
    console.log(this.schema.options)
    super.render();

    const length = Object.keys(this.schema.options).length;
    if(length > 3) {
      this.$el.addClass('selectpicker');
      setTimeout(() => {
        this.$el.selectpicker({});
      }, 0);
    }
    $(this.el).on('loaded.bs.select', function(){
      console.log('dd')
    });



    // setTimeout(() => {
    //   this.$el.selectpicker({});
    // }, 0);
    
    //this.$el.selectpicker('render');
    //$.fn.selectpicker.call(this.$el, {});


    // setTimeout(() => {
    //     this.$el.selectpicker({});
    //     console.log(this.el);
    //     }, 0);
    return this;
  }

  // renderOptions(options) {
  //   console.log($.fn.selectpicker.Constructor);
  //   $(document).on('show.bs.modal', ()=> {
  //     console.log(this);
  //   });
  //   super.renderOptions(options);
  //   setTimeout(() => {
  //       this.$el.selectpicker({});
  //       }, 200);
  // }
}

Backbone.Form.editors.Select = SelectEditor;
