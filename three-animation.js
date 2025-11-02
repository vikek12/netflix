class ThreeAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.textMesh = null;
        this.animationId = null;
        this.animationStyle = 'rotate';
        this.animationSpeed = 1;
        this.textColor = 0x00ffff;
        this.time = 0;
        
        this.init();
    }

    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.parentElement.clientWidth / this.canvas.parentElement.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(
            this.canvas.parentElement.clientWidth,
            this.canvas.parentElement.clientHeight
        );
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xffffff, 1);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff00ff, 0.5);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    createTextGeometry(text) {
        // Remove old text mesh if exists
        if (this.textMesh) {
            this.scene.remove(this.textMesh);
            if (this.textMesh.geometry) this.textMesh.geometry.dispose();
            if (this.textMesh.material) this.textMesh.material.dispose();
        }

        // Create text using TextGeometry alternative (3D shapes)
        const group = new THREE.Group();
        
        // Create 3D text using shapes for each character
        const loader = new THREE.FontLoader();
        
        // Since we can't load external fonts easily, we'll create 3D text using boxes
        // This is a simplified version - in production, you'd load proper fonts
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshPhongMaterial({
            color: this.textColor,
            shininess: 100,
            specular: 0x444444
        });

        // Create multiple boxes to represent text
        const textLength = text.length;
        const spacing = 0.6;
        const startX = -(textLength * spacing) / 2;

        for (let i = 0; i < Math.min(textLength, 20); i++) {
            const cube = new THREE.Mesh(geometry, material.clone());
            cube.position.x = startX + i * spacing;
            
            // Add some variation in height based on character
            const charCode = text.charCodeAt(i);
            cube.position.y = Math.sin(charCode) * 0.2;
            
            group.add(cube);
        }

        // Add a main text plane with texture
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 1024;
        canvas.height = 256;
        
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'Bold 80px Noto Sans Devanagari, Arial';
        context.fillStyle = '#' + this.textColor.toString(16).padStart(6, '0');
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text.substring(0, 30), canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const planeMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const planeGeometry = new THREE.PlaneGeometry(8, 2);
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        
        group.add(plane);
        
        this.textMesh = group;
        this.scene.add(this.textMesh);
    }

    setAnimationStyle(style) {
        this.animationStyle = style;
        this.time = 0;
    }

    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
    }

    setTextColor(color) {
        this.textColor = color;
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (!this.textMesh) return;

        this.time += 0.016 * this.animationSpeed;

        // Reset transformations
        this.textMesh.rotation.set(0, 0, 0);
        this.textMesh.position.set(0, 0, 0);
        this.textMesh.scale.set(1, 1, 1);

        // Apply animation based on style
        switch (this.animationStyle) {
            case 'rotate':
                this.textMesh.rotation.y = this.time;
                this.textMesh.rotation.x = Math.sin(this.time * 0.5) * 0.2;
                break;

            case 'wave':
                this.textMesh.position.y = Math.sin(this.time * 2) * 0.5;
                this.textMesh.rotation.z = Math.sin(this.time) * 0.1;
                break;

            case 'zoom':
                const scale = 1 + Math.sin(this.time * 2) * 0.3;
                this.textMesh.scale.set(scale, scale, scale);
                break;

            case 'bounce':
                this.textMesh.position.y = Math.abs(Math.sin(this.time * 3)) * 1.5;
                this.textMesh.rotation.y = this.time * 0.5;
                break;

            case 'spiral':
                const radius = 2;
                this.textMesh.position.x = Math.cos(this.time) * radius;
                this.textMesh.position.y = Math.sin(this.time) * radius;
                this.textMesh.rotation.z = this.time;
                break;

            case 'float':
                this.textMesh.position.y = Math.sin(this.time) * 0.3;
                this.textMesh.position.x = Math.cos(this.time * 0.7) * 0.3;
                this.textMesh.rotation.y = Math.sin(this.time * 0.5) * 0.3;
                break;
        }

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        if (!this.animationId) {
            this.animate();
        }
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    reset() {
        this.time = 0;
        if (this.textMesh) {
            this.textMesh.rotation.set(0, 0, 0);
            this.textMesh.position.set(0, 0, 0);
            this.textMesh.scale.set(1, 1, 1);
        }
    }

    onWindowResize() {
        const width = this.canvas.parentElement.clientWidth;
        const height = this.canvas.parentElement.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    getCanvas() {
        return this.canvas;
    }

    getRenderer() {
        return this.renderer;
    }

    dispose() {
        this.stop();
        
        if (this.textMesh) {
            this.scene.remove(this.textMesh);
            if (this.textMesh.geometry) this.textMesh.geometry.dispose();
            if (this.textMesh.material) this.textMesh.material.dispose();
        }

        if (this.renderer) {
            this.renderer.dispose();
        }

        window.removeEventListener('resize', () => this.onWindowResize());
    }
}
