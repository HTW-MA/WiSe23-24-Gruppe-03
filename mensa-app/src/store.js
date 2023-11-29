import { reactive, watch } from 'vue';

const state = reactive({
    selectedCanteen: localStorage.getItem('selectedCanteen') || 'defaultCanteen'
});


watch(() => state.selectedCanteen, (newValue) => {
    localStorage.setItem('selectedCanteen', newValue);
});

function updateSelectedCanteen() {
    state.selectedCanteen = localStorage.getItem('selectedCanteen') || 'defaultCanteen';
}

export default {
    state,
    updateSelectedCanteen
};