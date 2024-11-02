#!/usr/bin/env python
# coding: utf-8
# ------------------------------------------------------
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import newton
import warnings
import os
def Newton(f, x0, fprime=None, n=1):
    h = 1e-8
    if fprime==None:
        fprime = lambda x: (f(x+h)-f(x-h))/2/h
    for i in range(n):
        x0 = x0 - f(x0)/fprime(x0)
    return x0
# ------------------------------------------------------
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
    
    return min_dis, dis_
# ------------------------------------------------------
def hsv2rgb(h, s, v):
    '''
    HSV转RGB
    注意, h在(0-360), s,v在(0-1)

    版权声明：本文为CSDN博主「November丶Chopin」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
    原文链接：https://blog.csdn.net/u012762410/article/details/119038340
    '''
    h, s, v = map(float, (h, s, v))
    h60 = h / 60.0
    h60f = np.floor(h60)
    hi = int(h60f) % 6
    f = h60 - h60f
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    r, g, b = 0, 0, 0
    if hi == 0: r, g, b = v, t, p
    elif hi == 1: r, g, b = q, v, p
    elif hi == 2: r, g, b = p, v, t
    elif hi == 3: r, g, b = p, q, v
    elif hi == 4: r, g, b = t, p, v
    elif hi == 5: r, g, b = v, p, q
    return r, g, b 
# ------------------------------------------------------
def distance2colorImg(distance, dis_, degree=1):
    scale   = dis_/4
    scale = 1.0 - 0.1*scale**0.1
    scale[scale>1.0] = 1.0
    scale[scale<0.0] = 0.0
    distance = distance #* scale**degree

    (N,m,n) = distance.shape # how many roots
    img  = np.zeros((3,m,n))
    img_ = np.zeros((3,m,n))
    for i in range(N):
        (r,g,b) = hsv2rgb((360*i/N),1,1)
        img_[0] = distance[i] * r
        img_[1] = distance[i] * g
        img_[2] = distance[i] * b
        img = img + img_
    img[img>1.0] = 1.0
    img[img<0.0] = 0.0
    img = np.transpose(img,(1,2,0))
    (img*255).astype(np.uint8)
    return img
# ------------------------------------------------------
def save_fractal(fractal, file_name, dpi, figsize):
    fig = plt.figure(dpi=dpi, figsize=figsize)
    plt.imshow(fractal, interpolation='nearest',origin='lower')
    plt.axis('off')
    plt.savefig(file_name, bbox_inches='tight',pad_inches=0)
    plt.close()
# ------------------------------------------------------
def image_name(folder,i):
    return "%s/fractal%d.png"%(folder,i)
# ------------------------------------------------------
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

def FindRoots(f,fprime):
    x = np.linspace(-10,10,10)               
    (z0_r, z0_i) = np.meshgrid(x,x*1j)    
    z0 = z0_r + z0_i
    z0 = np.reshape(z0,z0.size)
    roots = np.array([])
    for x0 in z0:             
        z  = newton(f, x0, fprime=fprime, full_output=True, maxiter=1000)
        if z[1].flag =='converged':
            roots = np.append(roots,z[1].root)
    roots = np.unique(np.round(roots,7))
    return roots
# ------------------------------------------------------
f = lambda z: z**3 + 1
file_name = "z2+z2+1.png"

h = 1e-8
fprime = lambda x: (-f(x+2*h)+8*f(x+h)-8*f(x-h)+f(x-2*h))/12/h

roots = FindRoots(f,fprime)
for i in range(len(roots)):
    print("%d's root: (%8.5f) + i(%8.5f)"%(i+1,roots.real[i],roots.imag[i]))


# ------------------------------------------------------
warnings.filterwarnings('ignore')
n  = 1000
z1 = -1
z2 = 1
dpi = 10
size = (100,100)
grayscale = 5
distance, dis_ = newton_fractal(f, fprime, roots, n, z1, z2)
fractal = distance2colorImg(distance,dis_,degree=grayscale)

# os.system("rm %s"%file_name)
save_fractal(fractal, file_name, dpi, size)
os.system("open %s"%file_name)

del fractal
