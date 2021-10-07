import { toastController } from '@ionic/vue';

// TODO Use separate files for specific utilities

const showToast = async(message: string) => {
  const toast = await toastController
    .create({
      message: message,
      duration: 3000,
      position: 'bottom',
      buttons: [{
        text: 'Dismiss',
        role: 'cancel'
      }]
    })
  return toast.present();
}

export { showToast }