# Deploy to Firebase

## Deploy entire thing

```bash
firebase deploy
```

## Deploy only functions

```bash
firebase deploy --only functions
```

## Test firebase functions locally:

```bash
firebase functions:shell
```

Then provide a function call

```javascript
notifyNewSharedList({
  before: { id: "test", sharedUsers: {}, title: "Test List" },
  after: {
    id: "test",
    sharedUsers: { dRzSuLV9RDZhEoL4YywKxfvkOZ33: true },
    title: "Test List"
  }
});
```
