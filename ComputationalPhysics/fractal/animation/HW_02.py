#!/usr/bin/env python
# coding: utf-8

import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import newton
import warnings
import os
import cv2

def Newton(f, x0, fprime=None, n=1):
    h = 1e-8
    if fprime==None:
        fprime = lambda x: (f(x+h)-f(x-h))/2/h
    for i in range(n):
        x0 = x0 - f(x0)/fprime(x0)
    return x0


def newton_fractal(f, fprime, roots, n, fromZ, toZ):
    # ------ generate z0 ----------------------------------------------------------------                    
    x = np.linspace(fromZ,toZ,n)               
    (z0_r, z0_i) = np.meshgrid(x,x*1j)    
    z0 = z0_r + z0_i                      
    # ------ solving z* -----------------------------------------------------------------
    z  = newton(f, z0, fprime=fprime)      
    z_ = Newton(f, z0, fprime=fprime, n=6)
    # ------ solving min distance -------------------------------------------------------
    roots_n = roots.size                  
    dis     = np.zeros([roots_n, n, n])       
    dis_    = np.zeros([roots_n, n, n])       
    for i in range(roots_n):              
        dis[i]  = np.abs(z  - roots[i])     
        dis_[i] = np.abs(z_ - roots[i])
    min_dis = (np.round(dis)==0)*1.0      
    # ------ scale function -------------------------------------------------------------
    scale   = dis_/4
    scale = 1.0 - 0.5*scale**0.1
    scale[scale>1.0] = 1.0
    scale[scale<0.0] = 0.0
    # ------ saving image ---------------------------------------------------------------
    min_dis = min_dis * scale                   
    img = np.transpose(min_dis,(1,2,0))   
    img = (img*255).astype(np.uint8)
    return img


def save_fractal(fractal, folder, dpi, figsize):
    fig = plt.figure(dpi=dpi, figsize=figsize)
    plt.imshow(fractal, interpolation='nearest',origin='lower')
    plt.axis('off')
    plt.savefig(folder, bbox_inches='tight',pad_inches=0)
    plt.close()

def image_name(folder,i):
    return "%s/fractal%d.png"%(folder,i)

def create_video(image_folder, video_name, N, fps=1):
    fourcc = cv2.VideoWriter_fourcc(*'MP4V')
    images = [img for img in os.listdir(image_folder) if img.endswith(".png")]
    frame = cv2.imread(os.path.join(image_folder, images[0]))
    height, width, layers = frame.shape

    video = cv2.VideoWriter(video_name, fourcc, fps, (width,height))
    for i in range(N):
        video.write(cv2.imread( image_name(image_folder,i) ))

    cv2.destroyAllWindows()
    video.release()



f = lambda z: z**3 - 1
fprime = lambda z: 3*z**2

z1 = newton(f, 0.5+0.0j, fprime = fprime)
z2 = newton(f, 0.0+0.5j, fprime = fprime)
z3 = newton(f, 0.0-0.5j, fprime = fprime)
roots = np.array([z1,z2,z3])

# ------------------------------------------------------
dz = 0.1
z = np.arange(dz,1+dz,dz)
warnings.filterwarnings('ignore')

for i in range(len(z)):
    n  = 100
    z1 = -z[i]
    z2 = z[i]
    dpi = 100
    size = (10,10)
    if not os.path.isdir("%d"%n):
        os.mkdir("%d"%n)
    file = image_name(str(n),i)

    fractal = newton_fractal(f, fprime, roots, n, z1, z2)
    save_fractal(fractal, file, dpi, size)

    print("The %d's image is done."%(i+1))

create_video(str(n),"fractal%d.mp4"%n, len(z), fps=30)

