import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
    static get events() {
        return {
            READY: "ready",
        };
    }

    constructor() {
        super();
        this._loading = document.querySelector(".progress");
        this.url = `https://swapi.boom.dev/api/planets`;

        this._startLoading();
        this._create();

        this.emit(Application.events.READY);
    }

    _startLoading() {
        this._loading.style.display = "block";
    }

    _hasNext(){
        this._load()
        .then((response => {

            if (response.next) { 
                this.url = response.next;
                console.log(this.url)
                this._create;                  
            } 
        }));
    }

    _create() {
        this._load()
            .then((response) => {

                response.results.forEach((planet) => {
                    const box = document.createElement("div");
                    box.classList.add("box");
                    box.innerHTML = this._render({
                        name: planet.name,
                        terrain: planet.terrain,
                        population: planet.population,
                    });
                    this._stopLoading();
                    document.body.querySelector(".main").appendChild(box);
                });
            }).catch(err => {
                 console.log(`Can't create...Error message: ${err}`);
             }); 
                
            this._hasNext();              
    }

    async _load() {

        return await fetch(this.url).then((response => {

            if (!response.ok) {
                console.log(`Can't load...Error status: ${response.status}`);
                return;
            }

            const planets =  response.json();
            return planets;

        })); 
    }

    _stopLoading() {
        this._loading.style.display = "none";
    }

    _render({ name, terrain, population }) {
        return `
    <article class="media">
      <div class="media-left">
        <figure class="image is-64x64">
          <img src="${image}" alt="planet">
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
        <h4>${name}</h4>
          <p>
            <span class="tag">${terrain}</span> <span class="tag">${population}</span>
            <br>
          </p>
        </div>
      </div>
    </article>
        `;
    }
}
