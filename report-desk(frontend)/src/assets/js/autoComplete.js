const DEFAULTS = {
  threshold: 2,
  maximumItems: 5,
  highlightTyped: true,
  highlightClass: 'text-primary',
  label: 'label',
  value: 'value',
  showValue: false,
  showValueBeforeLabel: false,
};

class Autocomplete {
    constructor(field, options) {
      this.field = field;
      this.options = Object.assign({}, DEFAULTS, options);
      this.dropdown = null;
  
      field.parentNode.classList.add('dropdown');
      field.setAttribute('data-bs-toggle', 'dropdown');
      field.classList.add('dropdown-toggle');
  
      const dropdown = ce(`<div class="dropdown-menu"></div>`);
      if (this.options.dropdownClass)
        dropdown.classList.add(this.options.dropdownClass);
  
      insertAfter(dropdown, field);
  
      this.dropdown = new bootstrap.Dropdown(field, this.options.dropdownOptions);
  
      field.addEventListener('click', (e) => {
        if (this.createItems() === 0) {
          e.stopPropagation();
          this.dropdown.hide();
        }
      });
  
      field.addEventListener('input', () => {
        if (this.options.onInput)
          this.options.onInput(this.field.value);
        this.renderIfNeeded();
      });
  
      field.addEventListener('keydown', (e) => {
        if (e.keyCode === 27) {
          this.dropdown.hide();
          return;
        }
        if (e.keyCode === 40) {
          this.dropdown._menu.children[0]?.focus();
          return;
        }
      });
    }
  
    setData(data) {
      this.options.data = data;
      this.renderIfNeeded();
    }
  
    renderIfNeeded() {
      if (this.createItems() > 0)
        this.dropdown.show();
      else
        this.field.click();
    }
  
    createItem(lookup, item) {
      let label;
      if (this.options.highlightTyped) {
        const idx = removeDiacritics(item.label)
            .toLowerCase()
            .indexOf(removeDiacritics(lookup).toLowerCase());
        const className = Array.isArray(this.options.highlightClass) ? this.options.highlightClass.join(' ')
          : (typeof this.options.highlightClass == 'string' ? this.options.highlightClass : '');
        label = item.label.substring(0, idx)
          + `<span class="${className}">${item.label.substring(idx, idx + lookup.length)}</span>`
          + item.label.substring(idx + lookup.length, item.label.length);
      } else {
        label = item.label;
      }
  
      if (this.options.showValue) {
        if (this.options.showValueBeforeLabel) {
          label = `${item.value} ${label}`;
        } else {
          label += ` ${item.value}`;
        }
      }
  
      return ce(`<button type="button" class="dropdown-item" data-label="${item.label}" data-value="${item.value}">${label}</button>`);
    }
  
    createItems() {
      const lookup = this.field.value;
      if (lookup.length < this.options.threshold) {
        this.dropdown.hide();
        return 0;
      }
  
      const items = this.field.nextSibling;
      items.innerHTML = '';
  
      const keys = Object.keys(this.options.data);
  
      let count = 0;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const entry = this.options.data[key];
        const item = {
            label: this.options.label ? entry[this.options.label] : key,
            value: this.options.value ? entry[this.options.value] : entry
        };
  
        if (removeDiacritics(item.label).toLowerCase().indexOf(removeDiacritics(lookup).toLowerCase()) >= 0) {
          items.appendChild(this.createItem(lookup, item));
          if (this.options.maximumItems > 0 && ++count >= this.options.maximumItems)
            break;
        }
      }
  
      this.field.nextSibling.querySelectorAll('.dropdown-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          let dataLabel = e.target.getAttribute('data-label');
          let dataValue = e.target.getAttribute('data-value');
  
          this.field.value = dataLabel;
  
          if (this.options.onSelectItem) {
            this.options.onSelectItem({
              value: dataValue,
              label: dataLabel
            });
          }
  
          this.dropdown.hide();
        })
      });
  
      return items.childNodes.length;
    }
  }
  
  /**
   * @param html
   * @returns {Node}
   */
  function ce(html) {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
  }
  
  /**
   * @param elem
   * @param refElem
   * @returns {*}
   */
  function insertAfter(elem, refElem) {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
  }
  
  /**
   * @param {String} str
   * @returns {String}
   */
  function removeDiacritics(str) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
  }
  
  
  // script
  const field = document.getElementById('input');
  const ac = new Autocomplete(field, {
      data: [{label: "I'm a label", value: 42}],
      maximumItems: 5,
      threshold: 1,
      onSelectItem: ({label, value}) => {
          console.log("user selected:", label, value);
      }
  });
  
  ac.setData([
      {
          "label": "Aerospace and aviation",
          "value": "Aerospace and aviation"
      },
      {
          "label": "Agriculture",
          "value": "Agriculture"
      },
      {
          "label": "Appliances",
          "value": "Appliances"
      },
      {
          "label": "Automotive",
          "value": "Automotive"
      },
      {
          "label": "Banking and financial services",
          "value": "Banking and financial services"
      },
      {
          "label": "Biometrics",
          "value": "Biometrics"
      },
      {
          "label": "CSR and governance",
          "value": "CSR and governance"
      },
      {
          "label": "Construction and building",
          "value": "Construction and building"
      },
      {
          "label": "Customer service",
          "value": "Customer service"
      },
      {
          "label": "Data protection",
          "value": "Data protection"
      },
      {
          "label": "Electrical and electronic",
          "value": "Electrical and electronic"
      },
      {
          "label": "Energy and utilities",
          "value": "Energy and utilities"
      },
      {
          "label": "Engineering",
          "value": "Engineering"
      },
      {
          "label": "Environmental management and sustainability",
          "value": "Environmental management and sustainability"
      },
      {
          "label": "Facilities management",
          "value": "Facilities management"
      },
      {
          "label": "Fire",
          "value": "Fire"
      },
      {
          "label": "Food and drink",
          "value": "Food and drink"
      },
      {
          "label": "Graphic Technology",
          "value": "Graphic Technology"
      },
      {
          "label": "Healthcare",
          "value": "Healthcare"
      },
      {
          "label": "Health and safety",
          "value": "Health and safety"
      },
      {
          "label": "ICT and telecoms",
          "value": "ICT and telecoms"
      },
      {
          "label": "Import export",
          "value": "Import export"
      },
      {
          "label": "Information management",
          "value": "Information management"
      },
      {
          "label": "Innovation and design",
          "value": "Innovation and design"
      },
      {
          "label": "Internet of Things",
          "value": "Internet of Things"
      },
      {
          "label": "Lighting",
          "value": "Lighting"
      },
      {
          "label": "Manufacturing and processing",
          "value": "Manufacturing and processing"
      },
      {
          "label": "Measurement and metrology",
          "value": "Measurement and metrology"
      },
      {
          "label": "Medical devices",
          "value": "Medical devices"
      },
      {
          "label": "Mining and materials",
          "value": "Mining and materials"
      },
      {
          "label": "Nanotechnology",
          "value": "Nanotechnology"
      },
      {
          "label": "Pressure vessels",
          "value": "Pressure vessels"
      },
      {
          "label": "Quality and business improvement",
          "value": "Quality and business improvement"
      },
      {
          "label": "Risk",
          "value": "Risk"
      },
      {
          "label": "Security",
          "value": "Security"
      },
      {
          "label": "Transport and logistics",
          "value": "Transport and logistics"
      },
      {
          "label": "Waste and recycling",
          "value": "Waste and recycling"
      },
      {
          "label": "Welding",
          "value": "Welding"
      }
  ]);
