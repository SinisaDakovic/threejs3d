
uniform float uTime;
uniform float uVelocity;
uniform float uPixelRatio;
uniform float uSize;
uniform float uSpeed;

attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // modelPosition.y += cos(uTime * modelPosition.x * modelPosition.z);

    // modelPosition.y -= uVelocity;
    // modelPosition.x += sin(uTime * 0.2 + modelPosition.z);
    // modelPosition.z += cos(uTime * 0.2 + modelPosition.x);
   

    
    
    modelPosition.x += cos((uTime + modelPosition.z) * 0.25 * 1.5);
    modelPosition.y -= uVelocity + uSpeed;
    modelPosition.z += sin((uTime + modelPosition.x) * 0.25 * 1.5);

    if(modelPosition.y <= 0.0){
            modelPosition.y = 10.0;
        
        }

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    
    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z);
}