new p5();


var target;
class DNA{
  constructor(){
    this.genes=[];
    for(var i=0;i<100;i++){
      this.genes.push(p5.Vector.random2D());
      var rand=random(0,0.1);
      this.genes[i].mult(p5.prototype.random(0,0.5));

    }
  }
}


class Obstacle {
  constructor(x, y, w, h) {
    this.position = createVector(x, y);
    this.w = w;
    this.h = h;
  }

  display() {
    stroke(0);
    fill(175);
    strokeWeight(2);
    rectMode(CORNER);
    rect(this.position.x, this.position.y, this.w, this.h);
  }

  contains(spot) {
    if (spot.x > this.position.x && spot.x < this.position.x + this.w && spot.y > this.position.y && spot.y < this.position.y + this.h) {
      return true;
    } else {
      return false;
    }
  }

}

class Rocket{

  constructor(){
    this.location =  p5.prototype.createVector(320,380);
    this.velocity=p5.prototype.createVector();
    this.acc =p5.prototype.createVector();
    this.geneCount=0;
    //let d = p5.prototype.dist(this.location.x,this.location.y,target.x,target.y);
    this.fitness;

    this.dna=new DNA();
    this.hitTarget=false;
  }
  calfit(obj){

    let d = p5.prototype.dist(this.location.x,this.location.y,target.x,target.y);

    this.fitness=(1/d)*(1/d);
    console.log("this is "+ this.fitness);

  }
  applyForce(vec){
    this.acc.add(vec);
  }
  checkTarget() {
   let d = dist(this.location.x, this.location.y, target.x, target.y);
   if (d < 5) {
     //console.log("hit");
     this.hitTarget = true;
   }
 }
  update(){
    this.velocity.add(this.acc);
    this.location.add(this.velocity);
    this.acc.mult(0);
  }

  run(obs){
    this.checkTarget();
    if(obs.contains(this.location)){
      this.fitness=this.fitness*0.1;
      this.hitTarget=true;

    }

    if(this.location.y<130 || this.location.x>390){

      this.fitness=this.fitness*2;
    
    }
    if(!this.hitTarget){
    this.applyForce(this.dna.genes[this.geneCount]);


  this.geneCount++;
  this.update();
}
  this.display();
  }

  display() {
    let theta = this.velocity.heading() + PI / 2;
    let r = 4;
    stroke(0);
    push();
    translate(this.location.x, this.location.y);
    rotate(theta);

    // Thrusters
    rectMode(CENTER);
    fill(0);
    rect(-r / 2, r * 2, r / 2, r);
    rect(r / 2, r * 2, r / 2, r);

    // Rocket body
    fill(255);
    beginShape(TRIANGLES);
    vertex(0, -r * 2);
    vertex(-r, r * 2);
    vertex(r, r * 2);
    endShape(CLOSE);

    pop();
  }




}





class Population{


  constructor(){
    this.num=200;
    this.matingPool=[];
    this.pops=[];
    for(var i=0;i<this.num;i++){
      this.pops.push(new Rocket());
    }
    this.mrate=0.1;

  }

  fitness(obj) {
   for (var i = 0; i < this.pops.length; i++) {
     this.pops[i].calfit(obj);
   }
 }
selection(blockade){

  this.fitness(blockade);
  for(var i=0;i<this.pops.length;i++){
    var n=int(this.pops[i].fitness*100000);
    console.log(n);
    for(var j=0;j<n;j++){
      this.matingPool.push(this.pops[i]);
    }
  }
  //console.log("yeh hai",this.matingPool.length);

}
  mutation(obj1){
    var mrate=0.01;

    for(var i=0;i<obj1.dna.genes.length;i++){
      if(random(1)<mrate){
        var ran=(p5.Vector.random2D());
        ran.mult(random(0,0.1))

        obj1.dna.genes[i]=ran;

      }
    }


  }
  crossover(obj2,obj1){
  var child = new Rocket();
    var point=int(random(obj2.dna.genes.length));
    for(var i=0;i<obj2.dna.genes.length;i++){
      if(i>point){
        child.dna.genes[i]=obj2.dna.genes[i];
      }
      else{
        child.dna.genes[i]=obj1.dna.genes[i];
      }
    }




    return child;
  }

  reproduce(){
    //console.log("hello");
    for(var i=0;i<this.pops.length;i++){
    var a = int(random(this.matingPool.length));
    var b=int(random(this.matingPool.length));
    //console.log(this.matingPool.length,a,b);
    var child= this.crossover(this.matingPool[a],this.matingPool[b]);
    this.mutation(child);
    this.pops[i]=child;
}
this.matingPool=[];
  }
  live(obs){
    for(var i=0;i<this.pops.length;i++){
      this.pops[i].run(obs);

    }
  }


}
var lifetime;
var population=new Population();
var lifeCount;
function setup(){
  createCanvas(640,360);

    target = p5.prototype.createVector(width / 2 - 12, 24, 24, 24);
  lifetime=200;
  lifeCount=0;
}
function draw(){


  background(255);
var obs= new Obstacle(140,180,250,10);
obs.display();
  ellipse(target.x, target.y, 24, 24);
  if(lifeCount<lifetime){
    population.live(obs);
    lifeCount++;
  }else{

    lifeCount=0;
    population.selection(obs);
    population.reproduce();


  }
}
