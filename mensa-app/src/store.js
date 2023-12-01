import { reactive } from 'vue';

const state = reactive({
    selectedCanteen: localStorage.getItem('selectedCanteen') || 'defaultCanteen'
});



function updateSelectedCanteen() {
    state.selectedCanteen = localStorage.getItem('selectedCanteen') || 'defaultCanteen';
}

export default {
    state,
    updateSelectedCanteen
};