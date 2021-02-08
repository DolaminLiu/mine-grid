<template>
     <div class="fluid container">

       <div  class="col-md-6">
           <draggable class="list-group" element="ul" v-model="list" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
             <transition-group type="transition" :name="'flip-list'">
               <li class="list-group-item" v-for="element in list" :key="element.order">

                 <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
                 {{element.name}}
                 <span class="badge">{{element.order}}</span>

                 <draggable v-if="element.notes" class="list-group" element="ul" :options="dragOptions" :move="onMove">
                    <transition-group class="list-group" :name="'flip-list'">
                      <li class="list-group-item" v-for="elementDeep in element.notes" :key="elementDeep.order">
                         {{elementDeep.name}} <span class="badge">{{ elementDeep.order }}</span>
                     </li>
                   </transition-group>
                 </draggable>
               </li>
             </transition-group>
         </draggable>
       </div>

       <div  class="list-group col-md-6">
         <pre>{{listString}}</pre>
       </div>

     </div>
</template>
<script>
import draggable from 'vuedraggable'

var folderOneReady = [
  {
    'name': 'LOREM IPSUM',
    'order': 1,
    'fixed': false
  },
  {
    'name': 'MAGNA ALIQUA',
    'order': 2,
    'fixed': false
  },
  {
    'name': 'DOLOREM LAUDANTIUM',
    'notes': [
      {
        'name': 'Note level deep One',
        'order': 31,
        'fixed': false
      },
      {
        'name': 'Note level deep two',
        'order': 32,
        'fixed': false
      },
      {
        'name': 'Note level deep deep three',
        'order': 33,
        'fixed': false
      }
    ],
    'order': 3,
    'fixed': false
  },
  {
    'name': 'SIT AMET',
    'order': 4,
    'fixed': false
  },
  {
    'name': 'NEMO',
    'order': 5,
    'fixed': false
  },
  {
    'name': 'ACCUSANTIUM',
    'order': 6,
    'fixed': false
  },
  {
    'name': 'ESSE',
    'order': 7,
    'fixed': false
  },
  {
    'name': 'DOLORES',
    'order': 8,
    'fixed': false
  }
]

export default {
  name: 'hello',
  components: {
    draggable
  },
  data () {
    return {
      list: folderOneReady,
      editable: true,
      isDragging: false,
      delayedDragging: false
    }
  },
  methods: {
    onMove ({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    }
  },
  computed: {
    dragOptions () {
      return {
        animation: 1,
        group: 'description',
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    },
    listString () {
      return JSON.stringify(this.list, null, 2)
    }
  },
  watch: {
    isDragging (newValue) {
      if (newValue) {
        this.delayedDragging = true
        return
      }
      this.$nextTick(() => {
        this.delayedDragging = false
      })
    }
  }
}

</script>
<style scoped>
      .itxst {
          margin: 10px;
           text-align :left;
      }
      .col {
          width: 40%;
          flex: 1;
          padding: 10px;
          border: solid 1px #eee;
          border-radius: 5px;
          float: left;
      }
      .col + .col {
          margin-left: 10px;
      }
      .item {
          padding: 6px 12px;
          margin: 0px 10px 0px 10px;
          border: solid 1px #eee;
          background-color: #f1f1f1;
          text-align: left;
      }
      .item + .item {
          border-top: none;
          margin-top: 6px;
      }

      .item:hover {
          background-color: #fdfdfd;
          cursor: move;
      }
      .item2 {
          padding: 6px 12px;
          margin: 0px 10px 0px 10px;
          border: solid 1px #eee;
          background-color: pink;
          text-align: left;
      }
      .item2 + .item2 {
          border-top: none;
          margin-top: 6px;
      }

      .item2:hover {
           outline: solid 1px #ddd;
          cursor: move;
      }
</style>
