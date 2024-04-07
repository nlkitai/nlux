import '../style.css';
import '@nlux-dev/themes/src/naked/components/animation.css';
import '@nlux-dev/themes/src/naked/components/Loader.css';
import {createLoaderDom} from '@nlux-dev/core/src/ui/Loader/create.ts';

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
