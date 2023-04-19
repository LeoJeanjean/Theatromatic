For send params with router.push with the 4.1.4 change, you can configure the router for transform the params in props like this :

```
{
path: '/scene/:script/:personnage', // :script and :personnage is the params
name: 'scene',
props: true, // configure the route for place the params value in props of the same name
component: () => import('../views/AboutView.vue')
}
```

```
<script>
export default {
  data () {
    return {}
  },
  props: { // you have to name the props like the params you want to get
    personnage: String,
    script : String
  }
}
</script>
```

Now if your use router.push like this :

```
router.push({ name: 'scene', params: {personnage: 'Michel', script: 'Fais une promenade'}})
```

And add console.log in the component like this :

```
<script>
export default {
  data () {
    return {}
  },
  props: {
    personnage: String,
    script : String
  },
  beforeMount() {
    console.log(this.personnage)
    console.log(this.script)
  }
}
</script>
```

The console return "Michel" then "Fais une balade".
