import AudioManager from "./AudioManager";

const {ccclass, property} = cc._decorator;


@ccclass
export default class MenuManager extends cc.Component {
    private logInButton: cc.Node = null;
    private signUpButton: cc.Node = null;

    private logInModal: cc.Node = null;
    private signUpModal: cc.Node = null;

    private logInEmailInput: cc.EditBox = null;
    private logInPasswordInput: cc.EditBox = null;
    private logInCancelButton: cc.Node = null;
    private logInEnterButton: cc.Node = null;
    private logInStatusLabel: cc.Label = null;
    
    private signUpEmailInput: cc.EditBox = null;
    private signUpPasswordInput: cc.EditBox = null;
    private signUpCancelButton: cc.Node = null;
    private signUpEnterButton: cc.Node = null;
    private signUpStatusLabel: cc.Label = null;


    protected onLoad(){
        this.logInButton = cc.find("Canvas/Log In Button");
        this.signUpButton = cc.find("Canvas/Sign Up Button");
        
        this.logInModal = cc.find("Canvas/Log In Modal");
        this.signUpModal = cc.find("Canvas/Sign Up Modal");
        this.logInModal.active = false;
        this.signUpModal.active = false;
        
        this.logInEmailInput = this.logInModal.getChildByName("Email Input").getComponent(cc.EditBox);
        this.logInPasswordInput = this.logInModal.getChildByName("Password Input").getComponent(cc.EditBox);
        this.logInCancelButton = this.logInModal.getChildByName("Cancel Button");
        this.logInEnterButton = this.logInModal.getChildByName("Enter Button");
        this.logInStatusLabel = this.logInModal.getChildByName("Status Label").getComponent(cc.Label);
        
        this.signUpEmailInput = this.signUpModal.getChildByName("Email Input").getComponent(cc.EditBox);
        this.signUpPasswordInput = this.signUpModal.getChildByName("Password Input").getComponent(cc.EditBox);
        this.signUpCancelButton = this.signUpModal.getChildByName("Cancel Button");
        this.signUpEnterButton = this.signUpModal.getChildByName("Enter Button");
        this.signUpStatusLabel = this.signUpModal.getChildByName("Status Label").getComponent(cc.Label);
        
        this.registerButtonEvents();
        this.registerInputEvents(); 
    }


    protected start(): void {
        AudioManager.instance.playBgm1();
    }


    private registerButtonEvents(){
        // Main
        this.logInButton.on(cc.Node.EventType.TOUCH_END, this.openLogInModal, this);
        this.signUpButton.on(cc.Node.EventType.TOUCH_END, this.openSignUpModal, this);

        // Log In Modal
        this.logInCancelButton.on(cc.Node.EventType.TOUCH_END, this.closeLogInModal, this);
        this.logInEnterButton.on(cc.Node.EventType.TOUCH_END, this.submitLogIn, this);

        // Sign Up Modal
        this.signUpCancelButton.on(cc.Node.EventType.TOUCH_END, this.closeSignUpModal, this);
        this.signUpEnterButton.on(cc.Node.EventType.TOUCH_END, this.submitSignUp, this);
    }


    private openLogInModal(){
        this.logInModal.active = true;
    }
    
    
    private closeLogInModal(){
        this.logInModal.active = false;
        this.clearInputs(this.logInEmailInput, this.logInPasswordInput);
        this.logInStatusLabel.string = "";
    }


    private openSignUpModal(){
        this.signUpModal.active = true;
    }
    
    
    private closeSignUpModal(){
        this.signUpModal.active = false;
        this.clearInputs(this.signUpEmailInput, this.signUpPasswordInput);
        this.signUpStatusLabel.string = "";
    }


    private async submitLogIn(){
        const email = this.logInEmailInput.string.trim();
        const password = this.logInPasswordInput.string.trim();

        if(!email || !password){
            this.logInStatusLabel.string = "Error: Email or Password can't be empty";
            return;
        }
        
        this.logInCancelButton.getComponent(cc.Button).interactable = false;
        this.logInEnterButton.getComponent(cc.Button).interactable = false;

        // Firebase login
        try{
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log(`Login success! UID: ${userCredential.user.uid}`);
            
            this.logInStatusLabel.string = "";
            cc.director.loadScene("menu");
        }
        catch(error: any){
            switch(error.code){
                case 'auth/invalid-email':
                    this.logInStatusLabel.string = "Error: Invalid email";
                    break;
               case 'auth/invalid-credential':
                    this.logInStatusLabel.string = "Error: Wrong password";
                    break;
                default:
                    this.logInStatusLabel.string = `Error: ${error.message}`;
                    break;
            }

            this.logInCancelButton.getComponent(cc.Button).interactable = true;
            this.logInEnterButton.getComponent(cc.Button).interactable = true;
        }
    }


    private async submitSignUp(){
        const email = this.signUpEmailInput.string.trim();
        const password = this.signUpPasswordInput.string.trim();

        if(!email || !password){
            this.signUpStatusLabel.string = "Error: Email or Password can't be empty";
            return;
        }
        
        this.signUpCancelButton.getComponent(cc.Button).interactable = false;
        this.signUpEnterButton.getComponent(cc.Button).interactable = false;

        // Firebase sign up
        try{
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            console.log(`Signup success! UID: ${userCredential.user.uid}`);

            this.signUpStatusLabel.string = "";
            cc.director.loadScene("menu");
        }
        catch(error: any){
            switch(error.code){
                case 'auth/email-already-in-use':
                    this.signUpStatusLabel.string = "Error: Email already in use";
                    break;
                case 'auth/invalid-email':
                    this.signUpStatusLabel.string = "Error: Invalid email";
                    break;
                case 'auth/weak-password':
                    this.signUpStatusLabel.string = "Error: Password length < 6";
                    break;
                default:
                    this.signUpStatusLabel.string = `Error: ${error.message}`;
                    break;
            }

            this.signUpCancelButton.getComponent(cc.Button).interactable = true;
            this.signUpEnterButton.getComponent(cc.Button).interactable = true;
        }
    }


    private clearInputs(emailBox: cc.EditBox, passwordBox: cc.EditBox){
        if (emailBox) emailBox.string = "";
        if (passwordBox) passwordBox.string = "";
    }
    

    private registerInputEvents(){
        this.logInEmailInput.node.on('text-changed', this.filterInput, this);
        this.logInPasswordInput.node.on('text-changed', this.filterInput, this);
        this.signUpEmailInput.node.on('text-changed', this.filterInput, this);
        this.signUpPasswordInput.node.on('text-changed', this.filterInput, this);
    }


    private filterInput(editbox: cc.EditBox){
        const currentText = editbox.string;
        
        // Allowed: a-z, A-Z, 0-9, _, @, and .
        const cleanText = currentText.replace(/[^a-zA-Z0-9_@.]/g, '');

        if(currentText !== cleanText) editbox.string = cleanText;
    }
}