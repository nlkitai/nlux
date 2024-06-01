import '../style.css';
import '@nlux-dev/themes/src/luna/main.css';
import {createLoaderDom} from '../../../../../packages/shared/src/components/Loader/create';

const newExpo = document.createElement('div');
newExpo.innerHTML = `
  <div class="nlux_root expo-container">
    <h3>Loader Comp</h3>
    <div class="Loader-expo">
        <div class="content">
            <!-- Message component will be rendered here -->
        </div>
    </div>
  </div>
`;

document.querySelector<HTMLDivElement>('#app')!.append(newExpo);

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector<HTMLDivElement>('.Loader-expo .content')!;
    const loader = createLoaderDom();
    container.append(loader);
});
